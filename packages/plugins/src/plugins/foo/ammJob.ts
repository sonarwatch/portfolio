import { Cache, Job, JobExecutor, NetworkId } from '@sonarwatch/portfolio-core';
import { marketsCachePrefix, platformId } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  await cache.setItem('market_id', 'market_object', {
    prefix: marketsCachePrefix,
    networkId: NetworkId.ethereum,
  });
};
const job: Job = {
  id: `${platformId}-markets`,
  executor,
};
export default job;
