import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  platformId,
  leverageVaultsUrl,
  leverageVaultsInfoKey,
} from './constants';
import { LeverageVaultInfo } from './types/vaults';

const executor: JobExecutor = async (cache: Cache) => {
  const vaults: AxiosResponse<LeverageVaultInfo[]> | null = await axios
    .get(leverageVaultsUrl)
    .catch(() => null);

  if (!vaults) return;

  await cache.setItem(leverageVaultsInfoKey, vaults.data, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-leverage-vaults`,
  executor,
  label: 'normal',
};
export default job;
