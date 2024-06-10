import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { cachePrefix, collectionsCacheKey, platformId } from './constants';
import { Collection } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  // TODO collection name and floor, from orderbook
  const collections: Collection[] = [];

  await cache.setItem(collectionsCacheKey, collections, {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-collections`,
  executor,
  label: 'normal',
};
export default job;
