import { getObjectFields } from '@mysten/sui.js';
import {
  BorrowLendRate,
  NetworkId,
  apyToApr,
  borrowLendRatesPrefix,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import {
  platformId,
  poolsInfos,
  reserveParentId,
  reservesKey,
  reservesPrefix,
  indexFactor,
  rateFactor,
} from './constants';
import { ReserveData } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const reservesDatas: ReserveData[] = [];
  for (const pool of poolsInfos) {
    const reserves = await client.getDynamicFieldObject({
      parentId: reserveParentId,
      name: { type: 'u8', value: pool.id.toString() },
    });

    if (reserves.data) {
      const fields = getObjectFields(reserves.data) as ReserveData;
      if (fields.value) reservesDatas.push(fields);
    }
  }

  await cache.setItem(reservesKey, reservesDatas, {
    prefix: reservesPrefix,
    networkId: NetworkId.sui,
  });

  for (const reserveData of reservesDatas) {
    const reserve = reserveData.value.fields;
    const tokenAddress = reserve.coin_type;
    const poolName = 'Main Pool';

    const depositedAmount = new BigNumber(
      reserve.supply_balance.fields.total_supply
    )
      .dividedBy(reserve.current_supply_index)
      .multipliedBy(10 ** indexFactor)
      .toNumber();
    const borrowedAmount = new BigNumber(
      reserve.borrow_balance.fields.total_supply
    )
      .dividedBy(reserve.current_borrow_index)
      .multipliedBy(10 ** indexFactor)
      .toNumber();

    const borrowingApy = new BigNumber(reserve.current_borrow_rate)
      .dividedBy(10 ** rateFactor)
      .toNumber();
    const lendingApy = new BigNumber(reserve.current_supply_rate)
      .dividedBy(10 ** rateFactor)
      .toNumber();

    const rate: BorrowLendRate = {
      tokenAddress,
      borrowYield: {
        apy: borrowingApy,
        apr: apyToApr(borrowingApy),
      },
      borrowedAmount,
      depositYield: {
        apy: lendingApy,
        apr: apyToApr(lendingApy),
      },
      depositedAmount,
      platformId,
      poolName,
    };

    await cache.setItem(`${reserveData.id.id}-${tokenAddress}`, rate, {
      prefix: borrowLendRatesPrefix,
      networkId: NetworkId.solana,
    });
  }
};

const job: Job = {
  id: `${platformId}-reserves`,
  executor,
};
export default job;
