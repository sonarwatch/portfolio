import { DynamicFieldPage, getObjectFields, getObjectId } from '@mysten/sui.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { clmmPoolsPrefix, platformId, poolTableId } from './constants';
import { getClientSui } from '../../utils/clients';
import { parsePool } from './helper';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const poolFactories: DynamicFieldPage = await client.getDynamicFields({
    parentId: poolTableId,
  });
  const poolFactoryIds = poolFactories.data.map(getObjectId);
  if (!poolFactoryIds.length) return;

  const poolFactoryInfos = await client.multiGetObjects({
    ids: poolFactoryIds,
    options: { showContent: true },
  });

  const poolIds = poolFactoryInfos.map((info) => {
    const fields = getObjectFields(info) as {
      value: {
        fields: {
          pool_id: string;
          pool_key: string;
        };
      };
    };
    return fields.value.fields.pool_id;
  });

  if (!poolIds.length) return;
  const pools = await client.multiGetObjects({
    ids: poolIds,
    options: { showContent: true },
  });

  const promises = pools.map((pool) => {
    const parsedPool = parsePool(pool);
    return cache.setItem(parsedPool.objectId, parsedPool, {
      prefix: clmmPoolsPrefix,
      networkId: NetworkId.sui,
    });
  });
  await Promise.allSettled(promises);
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
