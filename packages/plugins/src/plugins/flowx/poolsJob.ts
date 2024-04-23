import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, poolsKey, poolsOwner, poolsPrefix } from './constants';
import { getDynamicFields } from '../../utils/sui/getDynamicFields';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { getClientSui } from '../../utils/clients';
import { Pool, PoolObject, Pools } from './types';
import { parseTypeString } from '../../utils/aptos';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const [poolsIds] = await Promise.all([getDynamicFields(client, poolsOwner)
    .then((pools) => pools.map((p) => p.objectId))]);

  const poolsObjects = await multiGetObjects(client, poolsIds, {
    showContent: true,
  })
    .then((poolInfoObjects) => poolInfoObjects.map((poolInfoObject) => poolInfoObject.data?.content?.fields as PoolObject));

  const pools: Pools = {};
  for (const poolObject of poolsObjects) {
    const poolId = poolObject.name;
    if (!poolId) continue;

    const { keys: coinTypeLpToken } = parseTypeString(poolObject.value.fields.lp_custodian.type);
    const { keys: coinTypeRewardToken } = parseTypeString(poolObject.value.fields.reward_token_custodian.type);

    if (coinTypeLpToken && coinTypeRewardToken) {
      pools[poolId] = {
        lpToken: coinTypeLpToken[0].type,
        rewardToken: coinTypeRewardToken[0].type,
      } as Pool;
    }
  }

  await cache.setItem(poolsKey, pools, {
    prefix: poolsPrefix,
    networkId: NetworkId.sui
  });
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
  label: 'normal',
};
export default job;
