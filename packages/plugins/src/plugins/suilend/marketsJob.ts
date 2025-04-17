import {
  BorrowLendRate,
  NetworkId,
  aprToApy,
  borrowLendRatesPrefix,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { mainMarket, marketsKey, platformId } from './constants';
import { LendingMarket, MarketsInfo } from './types';
import { getBorrowApr, getDepositApr } from './helpers';
import { wadsDecimal } from '../save/constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const marketsObjects = await multiGetObjects<LendingMarket>(client, [
    mainMarket,
  ]);

  const promises = [];
  const rates: BorrowLendRate[] = [];
  const lendingMarkets: LendingMarket[] = [];

  for (const market of marketsObjects) {
    if (market.data?.content?.fields) {
      lendingMarkets.push(market.data.content.fields);
      for (const reserve of market.data.content.fields.reserves) {
        const borrowedAmount = new BigNumber(
          reserve.fields.borrowed_amount.fields.value
        );
        const availableAmount = new BigNumber(
          reserve.fields.available_amount
        ).times(10 ** wadsDecimal);
        const utilization = borrowedAmount.dividedBy(
          availableAmount.plus(borrowedAmount)
        );
        const borrowApr = getBorrowApr(
          utilization,
          borrowedAmount,
          availableAmount,
          reserve.fields
        );
        const depositApr = getDepositApr(
          utilization,
          borrowApr,
          reserve.fields
        );
        const rate = {
          poolName: reserve.fields.id.id,
          borrowedAmount: borrowedAmount.toNumber(),
          depositedAmount: borrowedAmount.plus(availableAmount).toNumber(),
          platformId,
          tokenAddress: reserve.fields.coin_type.fields.name,
          utilizationRatio: utilization.toNumber(),
          depositYield: { apr: depositApr, apy: aprToApy(depositApr) },
          borrowYield: { apr: -borrowApr, apy: -aprToApy(borrowApr) },
        };
        rates.push(rate);

        promises.push(
          cache.setItem(
            `${reserve.fields.id.id}-${reserve.fields.coin_type.fields.name}`,
            rate,
            {
              prefix: borrowLendRatesPrefix,
              networkId: NetworkId.sui,
            }
          )
        );
      }
    }
  }

  promises.push(
    cache.setItem<MarketsInfo>(
      marketsKey,
      {
        lendingMarkets,
        rates,
      },
      {
        prefix: platformId,
        networkId: NetworkId.sui,
      }
    )
  );

  await Promise.allSettled(promises);
};

const job: Job = {
  id: `${platformId}-markets`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
