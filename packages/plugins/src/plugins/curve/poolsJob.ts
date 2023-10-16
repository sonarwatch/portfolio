import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  poolsCachePrefix,
  platformId,
  lpAddresesCachePrefix,
  crvNetworkIds,
  crvNetworkIdBySwNetworkId,
} from './constants';
import { getPoolsData } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  for (let i = 0; i < crvNetworkIds.length; i++) {
    const crvNetworkId = crvNetworkIds[i];
    const networkId = crvNetworkIdBySwNetworkId[crvNetworkId];

    const pools = await getPoolsData(crvNetworkId);
    for (let j = 0; j < pools.length; j++) {
      const pool = pools[j];
      await cache.setItem(pool.lpTokenAddress, pool, {
        prefix: poolsCachePrefix,
        networkId,
      });
    }
    const lpTokenAddresses = pools.map((p) => p.lpTokenAddress);
    await cache.setItem(lpAddresesCachePrefix, lpTokenAddresses, {
      prefix: lpAddresesCachePrefix,
      networkId,
    });
  }
};
const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
