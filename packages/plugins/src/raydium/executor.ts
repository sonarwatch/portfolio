import { Context, JobExecutor, NetworkId } from '@sonarwatch/portfolio-core';
import { raydiumPrefix } from './prefixes';

const executor: JobExecutor = async (context: Context) => {
  const { cache } = context;
  await cache.set('abc', 3, {
    prefix: raydiumPrefix,
    networkId: NetworkId.solana,
  });
};
export default executor;
