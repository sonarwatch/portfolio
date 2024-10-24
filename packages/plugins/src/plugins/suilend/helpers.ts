import BigNumber from 'bignumber.js';
import { BorrowLendRate } from '@sonarwatch/portfolio-core';
import { LendingMarket, PoolReward, Reserve } from './types';

export function getPoolsRewardsMaps(
  lendingMarkets: LendingMarket[] | undefined
): [PoolRewardById, PoolsRewardByManagerId] {
  const poolRewardById: PoolRewardById = new Map();
  const poolsRewardByManagerId: PoolsRewardByManagerId = new Map();
  if (!lendingMarkets) return [poolRewardById, poolsRewardByManagerId];

  for (const lendingMarket of lendingMarkets) {
    const { reserves } = lendingMarket;
    for (const reserve of reserves) {
      const depositdPoolsRewards =
        reserve.fields.deposits_pool_reward_manager.fields.pool_rewards;
      for (const poolReward of depositdPoolsRewards) {
        if (!poolReward || !poolReward.fields) continue;
        poolRewardById.set(poolReward.fields.id.id, poolReward.fields);
      }
      poolsRewardByManagerId.set(
        reserve.fields.deposits_pool_reward_manager.fields.id.id,
        depositdPoolsRewards.map((data) => (data ? data.fields : null))
      );
      const borrowPoolsRewards =
        reserve.fields.borrows_pool_reward_manager.fields.pool_rewards;
      for (const poolReward of borrowPoolsRewards) {
        if (!poolReward || !poolReward.fields) continue;
        poolRewardById.set(poolReward.fields.id.id, poolReward.fields);
      }
      poolsRewardByManagerId.set(
        reserve.fields.borrows_pool_reward_manager.fields.id.id,
        borrowPoolsRewards.map((data) => (data ? data.fields : null))
      );
    }
  }
  return [poolRewardById, poolsRewardByManagerId];
}

type PoolRewardById = Map<string, PoolReward>;
type PoolsRewardByManagerId = Map<string, PoolReward[]>;

export function getRatesAsMap(borrowLendRates: BorrowLendRate[] | undefined) {
  const ratesByReserveId: Map<string, BorrowLendRate> = new Map();
  if (!borrowLendRates) return ratesByReserveId;
  for (const borrowLendRate of borrowLendRates) {
    const id = borrowLendRate.poolName;
    ratesByReserveId.set(id, borrowLendRate);
  }
  return ratesByReserveId;
}

export function getBorrowApr(
  utilization: BigNumber,
  borrowedAmount: BigNumber,
  availableAmount: BigNumber,
  reserveFields: Reserve
): number {
  const { interest_rate_aprs: rateAprs, interest_rate_utils: rateUtils } =
    reserveFields.config.fields.element.fields;

  if (borrowedAmount.isZero())
    return BigNumber(rateAprs[0])
      .dividedBy(10 ** 4)
      .toNumber();
  if (availableAmount.isZero())
    return BigNumber(rateAprs[rateAprs.length])
      .dividedBy(10 ** 4)
      .toNumber();

  for (let i = 0; i < rateUtils.length; i++) {
    const currentUtil = rateUtils[i] / 100;
    const nextUtil = rateUtils[i + 1] / 100;
    const currentApr = new BigNumber(rateAprs[i]).dividedBy(10 ** 4);
    const nextApr = new BigNumber(rateAprs[i + 1]).dividedBy(10 ** 4);
    if (utilization.isEqualTo(currentUtil)) {
      return currentApr.toNumber();
    }

    if (utilization.isLessThan(nextUtil)) {
      const utilizationDelta = utilization.minus(currentUtil);
      const utilStepsDelta = nextUtil - currentUtil;
      return utilizationDelta
        .dividedBy(utilStepsDelta)
        .times(nextApr.minus(currentApr))
        .plus(currentApr)
        .toNumber();
    }
  }
  return 0;
}

export function getDepositApr(
  utilization: BigNumber,
  borrowApr: number,
  reserveFields: Reserve
): number {
  return BigNumber(borrowApr)
    .times(
      1 -
        Number(reserveFields.config.fields.element.fields.spread_fee_bps) /
          10 ** 4
    )
    .times(utilization)
    .toNumber();
}
