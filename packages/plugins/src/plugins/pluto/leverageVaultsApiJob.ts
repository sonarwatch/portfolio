import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  leveragesVaultApiKey,
  leverageVaultsApiUrl,
  platformId,
} from './constants';
import { LeverageVaultAddress } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const vaults = await axios
    .get<{ production: { [key: string]: LeverageVaultAddress }[] }>(
      leverageVaultsApiUrl
    )
    .then((response) => response.data);

  await cache.setItem(leveragesVaultApiKey, Object.values(vaults.production), {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-leverage-vaults-api`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
