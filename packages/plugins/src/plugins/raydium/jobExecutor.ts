import { Cache, JobExecutor, NetworkId } from '@sonarwatch/portfolio-core';
import { cachePrefix } from './constants';

const jobExecutor: JobExecutor = async (cache: Cache) => {
  await cache.setItem('123', '456', {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  });
};
export default jobExecutor;
