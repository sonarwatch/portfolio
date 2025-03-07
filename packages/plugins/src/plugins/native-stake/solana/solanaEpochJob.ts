import { NetworkId } from '@sonarwatch/portfolio-core';
import { EpochInfo } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { getClientSolana } from '../../../utils/clients';
import { platformId } from '../constants';
import { epochInfoCacheKey } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const epochInfo: EpochInfo = await client.getEpochInfo();
  await cache.setItem(epochInfoCacheKey, epochInfo, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-solana-epoch`,
  executor,
  labels: ['normal'],
};
export default job;
