import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  poolsCachePrefix,
  platformId,
  crvNetworkIds,
  crvNetworkIdBySwNetworkId,
  poolsByAddressPrefix,
} from './constants';
import { getPoolsData } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  for (let i = 0; i < crvNetworkIds.length; i++) {
    const crvNetworkId = crvNetworkIds[i];
    const networkId = crvNetworkIdBySwNetworkId[crvNetworkId];

    const pools = await getPoolsData(crvNetworkId);
    for (let j = 0; j < pools.length; j++) {
      const pool = pools[j];
      await cache.setItem(pool.address, pool, {
        prefix: poolsCachePrefix,
        networkId,
      });
    }

    const poolsByAddresses: Map<string, string> = new Map();
    pools.forEach((p) => {
      poolsByAddresses.set(p.lpTokenAddress, p.address);
      if (p.gaugeAddress) poolsByAddresses.set(p.gaugeAddress, p.address);
    });
    await cache.setItem(
      poolsByAddressPrefix,
      Object.fromEntries(poolsByAddresses),
      {
        prefix: poolsByAddressPrefix,
        networkId,
      }
    );
  }
};
const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
