import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import {
  BorrowLendRate,
  NetworkId,
  aprToApy,
  borrowLendRatesPrefix,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { reserveApiUrl, platformId, reservesKey } from './constants';
import { ReserveEnhanced, ReserveResponse } from './types';
import { getBorrowApr, getDepositApr } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const reservesRes: AxiosResponse<ReserveResponse> | null = await axios
    .get(reserveApiUrl)
    .catch(() => null);

  if (!reservesRes) return;
  const promises = [];
  const rates: BorrowLendRate[] = [];
  const reservesEnhanced: ReserveEnhanced[] = [];
  for (const reserve of reservesRes.data.result.data.stats) {
    const availableAmount = new BigNumber(reserve.value.total_cash_available);
    const borrowedAmount = new BigNumber(reserve.value.total_borrowed);
    const utilization = borrowedAmount.dividedBy(
      borrowedAmount.plus(availableAmount)
    );

    const borrowApr = getBorrowApr(
      utilization,
      borrowedAmount,
      availableAmount,
      reserve
    );
    const depositApr = getDepositApr(utilization, borrowApr, reserve);

    const rate = {
      poolName: reserve.key,
      borrowedAmount: borrowedAmount.toNumber(),
      depositedAmount: borrowedAmount.plus(availableAmount).toNumber(),
      platformId,
      tokenAddress: reserve.key,
      utilizationRatio: utilization.toNumber(),
      depositYield: { apr: depositApr, apy: aprToApy(depositApr) },
      borrowYield: { apr: borrowApr, apy: aprToApy(borrowApr) },
    };
    rates.push(rate);

    reservesEnhanced.push({ ...reserve, rate });

    promises.push(
      cache.setItem(`${reserve.key}`, rate, {
        prefix: borrowLendRatesPrefix,
        networkId: NetworkId.aptos,
      })
    );
  }

  promises.push(
    cache.setItem(reservesKey, reservesEnhanced, {
      prefix: platformId,
      networkId: NetworkId.aptos,
    })
  );

  await Promise.allSettled(promises);
};

const job: Job = {
  id: `${platformId}-reserves`,
  networkIds: [NetworkId.aptos],
  executor,
  labels: ['normal', NetworkId.aptos],
};
export default job;
