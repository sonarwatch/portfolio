import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { marketsCacheKey, platformId } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  await cache.setItem(marketsCacheKey, 'market_object', {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-markets`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
