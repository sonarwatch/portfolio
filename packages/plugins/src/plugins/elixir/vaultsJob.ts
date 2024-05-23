import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, vaults, vaultsKey, vaultsPrefix } from './constants';
import { getClientSui } from '../../utils/clients';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { Vault } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const vaultObjects = await multiGetObjects<Vault>(
    client,
    vaults.map((v) => v.address)
  );

  await cache.setItem(vaultsKey, vaultObjects, {
    prefix: vaultsPrefix,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-vaults`,
  executor,
  label: 'normal',
};
export default job;
