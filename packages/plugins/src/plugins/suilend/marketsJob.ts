import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { mainMarket, platformId, poolsKey } from './constants';
import { LendingMarket, RewardInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const objects = await multiGetObjects<LendingMarket>(client, [mainMarket]);

  const poolsRewardsInfo: RewardInfo[] = [];
  for (const object of objects) {
    if (!object.data || !object.data.content) continue;
    const { fields } = object.data.content;
    const { reserves } = fields;

    for (const reserve of reserves) {
      const poolsRewards =
        reserve.fields.deposits_pool_reward_manager.fields.pool_rewards;
      for (const poolReward of poolsRewards)
        poolsRewardsInfo.push({
          poolId: poolReward.fields.id.id,
          rewardMint: poolReward.fields.coin_type.fields.name,
        });
    }
  }

  await cache.setItem(poolsKey, poolsRewardsInfo, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-markets`,
  executor,
  label: 'normal',
};
export default job;
