import { LendingMarket, PoolReward } from './types';

export function getPoolsRewardsAsMap(
  lendingMarkets: LendingMarket[] | undefined
): Map<string, PoolReward> | undefined {
  if (!lendingMarkets) return undefined;

  const rewardMintByPoolId: Map<string, PoolReward> = new Map();
  for (const lendingMarket of lendingMarkets) {
    const { reserves } = lendingMarket;
    for (const reserve of reserves) {
      const poolsRewards =
        reserve.fields.deposits_pool_reward_manager.fields.pool_rewards;
      for (const poolReward of poolsRewards)
        rewardMintByPoolId.set(poolReward.fields.id.id, poolReward.fields);
    }
  }
  return rewardMintByPoolId;
}
