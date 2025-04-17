import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { leveragesVaultKey, platformId } from './constants';
import { getAllLeverage } from './helper';

const executor: JobExecutor = async (cache: Cache) => {
  const vaults = await getAllLeverage();

  await cache.setItem(leveragesVaultKey, vaults, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-leverage-vaults`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
