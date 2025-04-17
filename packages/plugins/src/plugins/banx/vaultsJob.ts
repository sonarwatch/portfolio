import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  cachePrefix,
  platformId,
  banxApiVaultsUrl,
  vaultsCacheKey,
} from './constants';
import { Vault } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const resSpl = await axios.get<{ data: Vault[] }>(banxApiVaultsUrl, {
    timeout: 3000,
  });

  await cache.setItem(vaultsCacheKey, resSpl.data.data, {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-vaults`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};

export default job;
