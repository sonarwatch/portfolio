import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, supplyPoolsCacheKey, vaults } from './constants';
import { getClientSui } from '../../utils/clients';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { SupplyPool } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const supplyPools: Set<string> = new Set();
  vaults.forEach((v) => {
    supplyPools.add(v.supplyPoolXInfo);
    supplyPools.add(v.supplyPoolYInfo);
  });

  const objects = await multiGetObjects<SupplyPool>(client, [...supplyPools]);

  await cache.setItem(supplyPoolsCacheKey, objects, {
    networkId: NetworkId.sui,
    prefix: platformId,
  });
};
const job: Job = {
  id: `${platformId}-supply-pools`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
