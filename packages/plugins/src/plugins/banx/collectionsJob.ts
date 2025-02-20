import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  banxApiCollectionsUrl,
  cachePrefix,
  collectionsCacheKey,
  platformId,
} from './constants';
import { Collection } from './types';

/**
 * @deprecated
 * this job has been deprecated following protocol changes
 */
const executor: JobExecutor = async (cache: Cache) => {
  const res = await axios
    .get<{ data: Collection[] }>(banxApiCollectionsUrl, {
      timeout: 5000,
    })
    .catch((err) => {
      throw Error(`BANX_API ERR: ${err}`);
    });

  if (!res) {
    throw Error(`BANX_API NO RESPONSE`);
  }

  await cache.setItem(collectionsCacheKey, res.data.data, {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-collections`,
  executor,
  labels: ['normal'],
};

export default job;
