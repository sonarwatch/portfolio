import { nativeStakePlatformId, NetworkId } from '@sonarwatch/portfolio-core';
import { EpochInfo } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { getClientSolana } from '../../../utils/clients';
import { epochInfoCacheKey } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const epochInfo: EpochInfo = await client.getEpochInfo();
  await cache.setItem(epochInfoCacheKey, epochInfo, {
    prefix: nativeStakePlatformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${nativeStakePlatformId}-solana-epoch`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
