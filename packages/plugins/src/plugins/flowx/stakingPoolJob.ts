import { NetworkId, parseTypeString } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, poolsKey, poolsOwner, poolsPrefix } from './constants';
import { getDynamicFields } from '../../utils/sui/getDynamicFields';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { getClientSui } from '../../utils/clients';
import { Pool, PoolObject } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const [poolsIds] = await Promise.all([
    getDynamicFields(client, poolsOwner).then((pools) =>
      pools.map((p) => p.objectId)
    ),
  ]);
  const poolsObjects = await multiGetObjects<PoolObject>(client, poolsIds);

  const pools: Pool[] = [];
  for (const poolObject of poolsObjects) {
    const poolObjectFields = poolObject.data?.content?.fields.value.fields;
    if (!poolObjectFields) continue;

    const poolId = poolObject.data?.content?.fields.name;
    if (!poolId) continue;

    const { keys: coinTypeLpToken } = parseTypeString(
      poolObjectFields.lp_custodian.type
    );
    const { keys: coinTypeRewardToken } = parseTypeString(
      poolObjectFields.reward_token_custodian.type
    );
    if (!coinTypeLpToken || !coinTypeRewardToken) continue;

    pools[Number(poolId)] = {
      lpToken: coinTypeLpToken[0].type,
      rewardToken: coinTypeRewardToken[0].type,
    } as Pool;
  }

  await cache.setItem(poolsKey, pools, {
    prefix: poolsPrefix,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-staking-pool`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
