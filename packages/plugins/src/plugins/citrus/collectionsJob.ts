import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  cachePrefix,
  collectionsApiUrl,
  collectionsCacheKey,
  platformId,
} from './constants';
import { Collection } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const res = await axios
    .get<Collection[]>(collectionsApiUrl, {
      timeout: 5000,
    })
    .catch((err) => {
      throw Error(`CITRUS_API ERR: ${err}`);
    });

  if (!res) {
    throw Error(`CITRUS_API NO RESPONSE`);
  }

  await cache.setItem(collectionsCacheKey, res.data, {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-collections`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};

export default job;
