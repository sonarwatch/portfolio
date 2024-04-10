import {
  BorrowLendRate,
  NetworkId,
  aprToApy,
  borrowLendRatesPrefix,
} from '@sonarwatch/portfolio-core';
import { MarginfiProgram, platformId, banksKey } from './constants';
import { bankStruct } from './structs/Bank';
import { banksFilters } from './filters';
import { computeInterestRates, wrappedI80F48toBigNumber } from './helpers';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { BankInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const banksRawData = await getParsedProgramAccounts(
    connection,
    bankStruct,
    MarginfiProgram,
    banksFilters()
  );

  const banks: BankInfo[] = [];
  const rateItems = [];
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
};

const job: Job = {
  id: `${platformId}-banks`,
  executor,
  label: 'normal',
};
export default job;
