import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  platformId,
  leverageLendingVaultsInfoKey,
  leverageLendingVaultsUrl,
} from './constants';
import { LeverageVaultInfo } from './types/vaults';

const executor: JobExecutor = async (cache: Cache) => {
  const [leverageLendingVaults] = await Promise.all([
    axios.get<LeverageVaultInfo[]>(leverageLendingVaultsUrl).catch(() => null),
  ]);

  if (!leverageLendingVaults) return;

  await cache.setItem(
    leverageLendingVaultsInfoKey,
    leverageLendingVaults.data,
    {
      prefix: platformId,
      networkId: NetworkId.sui,
    }
  );
};

const job: Job = {
  id: `${platformId}-strategy-leverage-lending`,
  executor,
  labels: ['normal'],
};
export default job;
