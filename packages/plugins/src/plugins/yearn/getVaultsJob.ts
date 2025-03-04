import { EvmNetworkIdType, networks } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { vaultsKey } from './constants';
import { getVaults } from './helpers';

export default function getVaultsJob(
  networkId: EvmNetworkIdType,
  platformId: string
): Job {
  const executor: JobExecutor = async (cache: Cache) => {
    const vaults = (
      await getVaults({
        chainId: networks[networkId].chainId,
        network: networks[networkId],
      })
    ).filter((vault) => vault.endorsed);

    await cache.setItem(vaultsKey, vaults, { prefix: platformId, networkId });
  };

  return {
    executor,
    id: `${platformId}-${networkId}-vaults`,
    labels: ['normal', networkId],
  };
}
