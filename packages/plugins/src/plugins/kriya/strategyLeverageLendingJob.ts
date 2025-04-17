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
  const leverageLendingVaults = await axios.get<{ data: LeverageVaultInfo[] }>(
    leverageLendingVaultsUrl
  );

  if (!leverageLendingVaults) return;

  await cache.setItem(
    leverageLendingVaultsInfoKey,
    leverageLendingVaults.data.data,
    {
      prefix: platformId,
      networkId: NetworkId.sui,
    }
  );
};

const job: Job = {
  id: `${platformId}-strategy-leverage-lending`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
