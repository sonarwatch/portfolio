import { NetworkId } from '@sonarwatch/portfolio-core';
import { Pool } from './types';
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
): Promise<(Pool | null)[]> => {
  const pools = [];

  const cachedPools = await cache.getItems<Pool>(poolIds, {
    prefix: clmmPoolsPrefix,
    networkId: NetworkId.sui,
  });

  const client = getClientSui();

  for (const poolId of poolIds) {
    const i = poolIds.indexOf(poolId);
    const cachedPool = cachedPools[i];
    if (cachedPool) {
      pools.push(cachedPool);
    } else {
      const poolObject = await getObject(client, poolId);
      const pool = getPoolFromObject(poolObject);

      if (poolObject.data?.objectId !== poolId || !pool) {
        pools.push(null);
      }

      await cache.setItem(poolId, pool, {
        prefix: clmmPoolsPrefix,
        networkId: NetworkId.sui,
      });
      pools.push(pool);
    }
  }

  return pools;
};
