import { NetworkId } from '@sonarwatch/portfolio-core';
import { Pool, PoolStat } from './types';
import { clmmPoolsPrefix } from './constants';
import { Cache } from '../../Cache';
import { getClientSui } from '../../utils/clients';
import { getObject } from '../../utils/sui/getObject';
import { getPoolFromObject } from './helpers';

// always use this helper to get Cetus Pools
// use cache is available, get on-chain data otherwise
export const getPools = async (
  poolIds: string[],
  cache: Cache
): Promise<((Pool & PoolStat) | null)[]> => {
  const pools = [];

  const [cachedPools, cachedPoolsStats] = await Promise.all([
    cache.getItems<Pool>(poolIds, {
      prefix: clmmPoolsPrefix,
      networkId: NetworkId.sui,
    }),
    cache.getItems<PoolStat>(poolIds, {
      prefix: `${clmmPoolsPrefix}-stats`,
      networkId: NetworkId.sui,
    }),
  ]);

  const client = getClientSui();

  for (const poolId of poolIds) {
    const i = poolIds.indexOf(poolId);
    const cachedPool = cachedPools[i];
    const cachedPoolStat = cachedPoolsStats[i];

    let pool;

    if (cachedPool) {
      pool = cachedPool;
    } else {
      const poolObject = await getObject(client, poolId);
      pool = getPoolFromObject(poolObject);

      if (poolObject.data?.objectId !== poolId || !pool) {
        pool = null;
      }

      await cache.setItem(poolId, pool, {
        prefix: clmmPoolsPrefix,
        networkId: NetworkId.sui,
      });
    }

    if (pool && cachedPoolStat) {
      pools.push({ ...pool, ...cachedPoolStat });
    } else {
      pools.push(pool);
    }
  }

  return pools;
};
