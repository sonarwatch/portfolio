import {
  DynamicFieldPage,
  ObjectContentFields,
  getObjectFields,
  normalizeSuiObjectId,
} from '@mysten/sui.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { clmmPoolsPrefix, clmmPoolsHandle, platformId } from './constants';
import { getPoolFromObject } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const accounts: DynamicFieldPage = await client.getDynamicFields({
    parentId: clmmPoolsHandle,
  });
  const warpIds = accounts.data.map((item) => item.objectId);
  const objects = await client.multiGetObjects({
    ids: warpIds,
    options: { showContent: true },
  });
  const poolsAddresses = objects.map((object) => {
    const { fields } = (getObjectFields(object) as ObjectContentFields)[
      'value'
    ];
    return normalizeSuiObjectId(fields['pool_address']);
  });

  const poolsObjects = await client.multiGetObjects({
    ids: poolsAddresses,
    options: { showContent: true, showType: true },
  });
  for (const poolObject of poolsObjects) {
    const poolId = poolObject.data?.objectId;
    if (!poolId) continue;

    const pool = getPoolFromObject(poolObject);
    if (!pool) continue;

    await cache.setItem(poolId, pool, {
      prefix: clmmPoolsPrefix,
      networkId: NetworkId.sui,
    });
  }
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
