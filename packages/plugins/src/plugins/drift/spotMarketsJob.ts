import {
  BorrowLendRate,
  NetworkId,
  aprToApy,
  borrowLendRatesPrefix,
} from '@sonarwatch/portfolio-core';
import { DriftProgram, platformId, prefixSpotMarkets } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { spotMarketStruct } from './struct';
import { marketFilter } from './filters';
import { getClientSolana } from '../../utils/clients';
import { calculateBorrowRate, calculateDepositRate } from './helpers';
import { SpotMarketEnhanced } from './types';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const spotMarketsAccount = await getParsedProgramAccounts(
    client,
    spotMarketStruct,
    DriftProgram,
    marketFilter
  );
  if (!spotMarketsAccount) return;
  for (let index = 0; index < spotMarketsAccount.length; index++) {
    const spotMarketAccount = spotMarketsAccount[index];
    const depositApr = calculateDepositRate(spotMarketAccount).toNumber();
    const borrowApr = calculateBorrowRate(spotMarketAccount).toNumber();
    await cache.setItem<SpotMarketEnhanced>(
      spotMarketsAccount[index].marketIndex.toString(),
      {
        ...spotMarketAccount,
        depositApr,
        borrowApr,
      },
      { prefix: prefixSpotMarkets, networkId: NetworkId.solana }
    );
    const { decimals } = spotMarketAccount;
    const tokenAddress = spotMarketAccount.mint.toString();
    const borrowedAmount = spotMarketAccount.borrowBalance
      .div(10 ** decimals)
      .toNumber();
    const depositedAmount = spotMarketAccount.depositBalance
      .div(10 ** decimals)
      .toNumber();

    const rate: BorrowLendRate = {
      tokenAddress,
      borrowYield: {
        apy: aprToApy(borrowApr),
        apr: borrowApr,
      },
      borrowedAmount,
      depositYield: {
        apy: aprToApy(depositApr),
        apr: depositApr,
      },
      depositedAmount,
      platformId,
      poolName: 'Main',
    };

    await cache.setItem(
      `${spotMarketAccount.vault.toString()}-${tokenAddress}`,
      rate,
      {
        prefix: borrowLendRatesPrefix,
        networkId: NetworkId.solana,
      }
    );
  }
};

const job: Job = {
  id: `${platformId}-spotMarkets`,
  executor,
};
export default job;
