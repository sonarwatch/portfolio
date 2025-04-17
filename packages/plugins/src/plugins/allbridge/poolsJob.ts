import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  apiPoolInfoUrl,
  cachePrefix,
  platformId,
  poolsCacheKey,
} from './constants';
import { PoolsRes } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const res = await axios
    .get<PoolsRes>(apiPoolInfoUrl, {
      timeout: 5000,
    })
    .catch((err) => {
      throw Error(`ALLBRIDGE_API ERR: ${err}`);
    });

  if (!res) {
    throw Error(`ALLBRIDGE_API NO RESPONSE`);
  }

  await cache.setItem(poolsCacheKey, res.data.SOL, {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};

export default job;
