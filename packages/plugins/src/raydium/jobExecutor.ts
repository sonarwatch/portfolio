import { Context, JobExecutor, NetworkId } from '@sonarwatch/portfolio-core';
import { cachePrefix } from './constants';

const jobExecutor: JobExecutor = async (context: Context) => {
  const { cache } = context;
  await cache.set('123', '456', {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  });
};
export default jobExecutor;
