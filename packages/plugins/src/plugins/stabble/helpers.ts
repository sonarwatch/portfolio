import BigNumber from 'bignumber.js';
import { Miner, Rewarder, StakedPool } from './structs';

export function getRewards(
  rewarder: Rewarder,
  pool: StakedPool,
  miner: Miner
): BigNumber {
  const currentTime = Math.trunc(new Date().getTime() / 1000);
  const lastUpdatedTime = rewarder.lastUpdatedAt.toNumber();

  let { rewardsPerAmount } = pool;

  if (currentTime > lastUpdatedTime) {
    const elapsedTime = currentTime - lastUpdatedTime;

    let { rewardsPerWeight } = rewarder;

    if (rewarder.totalWeights.isGreaterThan(new BigNumber(0))) {
      rewardsPerWeight = rewarder.totalRewards
        .times(new BigNumber(elapsedTime))
        .div(rewarder.epochDuration)
        .times(new BigNumber(1000000000))
        .div(rewarder.totalWeights)
        .plus(rewarder.rewardsPerWeight);
    }

    if (pool.totalAmount.isGreaterThan(new BigNumber(0))) {
      rewardsPerAmount = rewardsPerWeight
        .times(pool.totalWeights)
        .div(new BigNumber(1000000000))
        .plus(pool.totalRewardsCredit)
        .minus(pool.totalRewardsDebt)
        .minus(pool.totalRewardsDistributed)
        .times(new BigNumber(1000000000))
        .div(pool.totalAmount)
        .plus(pool.rewardsPerAmount);
    }
  }

  return rewardsPerAmount
    .times(miner.amount)
    .div(new BigNumber(1000000000))
    .plus(miner.rewardsCredit)
    .minus(miner.rewardsDebt)
    .minus(miner.rewardsClaimed)
    .dividedBy(10 ** rewarder.decimals);
}
