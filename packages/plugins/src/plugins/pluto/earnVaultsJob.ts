import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { earnVaultsKey, platformId } from './constants';
import { getVaultEarns } from './helper';

const executor: JobExecutor = async (cache: Cache) => {
  const earns = await getVaultEarns();

  await cache.setItem(earnVaultsKey, earns, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-earn-vaults`,
  executor,
  labels: ['normal'],
};
export default job;
