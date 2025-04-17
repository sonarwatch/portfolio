import {
  BorrowLendRate,
  NetworkId,
  aprToApy,
  borrowLendRatesPrefix,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  driftProgram,
  keySpotMarkets,
  oracleToMintKey,
  platformId,
} from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { spotMarketStruct } from './struct';
import { marketFilter } from './filters';
import { getClientSolana } from '../../utils/clients';
import {
  SPOT_MARKET_RATE_PRECISION,
  calculateBorrowRate,
  calculateDepositRate,
  divCeil,
} from './helpers';
import { SpotMarketEnhanced } from './types';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const spotMarketsAccount = await getParsedProgramAccounts(
    client,
    spotMarketStruct,
    driftProgram,
    marketFilter
  );
  if (!spotMarketsAccount) return;

  // Oracle to mint
  const oracleToMint: [string, string][] = [];
  for (let i = 0; i < spotMarketsAccount.length; i++) {
    const acc = spotMarketsAccount[i];
    oracleToMint.push([acc.oracle.toString(), acc.mint.toString()]);
  }
  await cache.setItem(oracleToMintKey, oracleToMint, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  const spotMarkets: SpotMarketEnhanced[] = [];
  for (let index = 0; index < spotMarketsAccount.length; index++) {
    const spotMarketAccount = spotMarketsAccount[index];
    const depositApr = calculateDepositRate(spotMarketAccount).toNumber();
    const borrowApr = calculateBorrowRate(spotMarketAccount).toNumber();
    spotMarkets.push({
      ...spotMarketAccount,
      depositApr,
      borrowApr,
    });
    const { decimals } = spotMarketAccount;
    const precisionDecrease = new BigNumber(10).pow(
      new BigNumber(19 - decimals)
    );

    const tokenAddress = spotMarketAccount.mint.toString();
    const borrowedAmount = divCeil(
      spotMarketAccount.borrowBalance.multipliedBy(
        spotMarketAccount.cumulativeBorrowInterest.div(
          SPOT_MARKET_RATE_PRECISION
        )
      ),
      precisionDecrease
    ).toNumber();

    const depositedAmount = spotMarketAccount.depositBalance
      .multipliedBy(
        spotMarketAccount.cumulativeDepositInterest.div(
          SPOT_MARKET_RATE_PRECISION
        )
      )
      .div(precisionDecrease)
      .toNumber();

    if (borrowedAmount <= 10 && depositedAmount <= 10) continue;

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

  await cache.setItem<SpotMarketEnhanced[]>(keySpotMarkets, spotMarkets, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-spotMarkets`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
