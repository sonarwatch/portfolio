import {
  BorrowLendRate,
  NetworkId,
  TokenPriceSource,
  aprToApy,
  borrowLendRatesPrefix,
  solanaNativeAddress,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { group, lendingV2Pid, platformId } from './constants';
import { banksKey } from '../marginfi/constants';
import { bankStruct } from '../marginfi/structs/Bank';
import {
  computeInterestRates,
  wrappedI80F48toBigNumber,
} from '../marginfi/helpers';
import { mintAccountStruct } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { BankInfo } from '../marginfi/types';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { stakeAccountStruct } from '../native-stake/solana/structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const banksRawData = await ParsedGpa.build(
    connection,
    bankStruct,
    lendingV2Pid
  )
    .addFilter('discriminator', [142, 49, 166, 242, 50, 66, 97, 188])
    .addFilter('group', group)
    .addDataSizeFilter(bankStruct.byteSize)
    .run();

  const banks: BankInfo[] = [];
  const rateItems = [];
  const sources: TokenPriceSource[] = [];
  const solPrice = await cache.getTokenPrice(
    solanaNativeAddress,
    NetworkId.solana
  );
  for (let index = 0; index < banksRawData.length; index += 1) {
    const bank = banksRawData[index];
    const { lendingApr, borrowingApr } = computeInterestRates(bank);

    banks.push({
      ...bank,
      dividedAssetShareValue: wrappedI80F48toBigNumber(bank.assetShareValue)
        .div(10 ** bank.mintDecimals)
        .toString(),
      dividedLiabilityShareValue: wrappedI80F48toBigNumber(
        bank.liabilityShareValue
      )
        .div(10 ** bank.mintDecimals)
        .toString(),
      suppliedLtv: wrappedI80F48toBigNumber(bank.config.assetWeightMaint)
        .decimalPlaces(2)
        .toNumber(),
      suppliedYields: [
        {
          apy: aprToApy(lendingApr),
          apr: lendingApr,
        },
      ],
      borrowedWeight: wrappedI80F48toBigNumber(bank.config.liabilityWeightMaint)
        .decimalPlaces(2)
        .toNumber(),
      borrowedYields: [
        {
          apy: -aprToApy(borrowingApr),
          apr: -borrowingApr,
        },
      ],
    });

    const depositedAmount = wrappedI80F48toBigNumber(bank.liabilityShareValue)
      .times(wrappedI80F48toBigNumber(bank.totalLiabilityShares))
      .toNumber();
    const borrowedAmount = wrappedI80F48toBigNumber(bank.assetShareValue)
      .times(wrappedI80F48toBigNumber(bank.totalAssetShares))
      .toNumber();
    if (borrowedAmount <= 1 && depositedAmount <= 1) continue;

    const tokenAddress = bank.mint.toString();

    // Price the SPL generated for Native Stake Collateral : https://docs.marginfi.com/staked-collateral
    // Each validator has it's own Stake Account, in which Marginfi deposit the Native Stake deposited by the user
    // Margingi then mint a SPL token which represent the deposit

    if (bank.config.assetTag === 2) {
      const stakeAccountAddress = bank.config.oracleKeys_3;
      const [mintAccount, stakeAccount] = await Promise.all([
        getParsedAccountInfo(connection, mintAccountStruct, bank.mint),
        getParsedAccountInfo(
          connection,
          stakeAccountStruct,
          stakeAccountAddress
        ),
      ]);
      if (mintAccount && solPrice && stakeAccount) {
        const { supply } = mintAccount;
        const price = stakeAccount.stake
          .minus(LAMPORTS_PER_SOL)
          .times(solPrice.price)
          .dividedBy(supply)
          .toNumber();
        sources.push({
          address: tokenAddress,
          decimals: mintAccount.decimals,
          id: bank.pubkey.toString(),
          networkId: NetworkId.solana,
          platformId: walletTokensPlatformId,
          price,
          timestamp: Date.now(),
          weight: 1,
          elementName: 'Stake Collateral',
        });
      }
    }

    const poolName =
      bank.config.riskTier === 0 ? 'Global Pool' : 'Isolated Pool';

    const rate: BorrowLendRate = {
      tokenAddress,
      borrowYield: {
        apy: aprToApy(borrowingApr),
        apr: borrowingApr,
      },
      borrowedAmount,
      depositYield: {
        apy: aprToApy(lendingApr),
        apr: lendingApr,
      },
      depositedAmount,
      platformId,
      poolName,
    };

    rateItems.push({
      key: `${bank.pubkey.toString()}-${tokenAddress}`,
      value: rate,
    });
  }
  await cache.setItem(banksKey, banks, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  await cache.setItems(rateItems, {
    prefix: borrowLendRatesPrefix,
    networkId: NetworkId.solana,
  });
  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-banks`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
