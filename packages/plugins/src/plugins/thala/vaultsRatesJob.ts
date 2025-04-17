import {
  platformId,
  packageId,
  vaultCollateralParamsFilter,
} from './constants';
import { getClientAptos } from '../../utils/clients';
import { VaultCollateralParamsRessource } from './types';
import { fp64ToFloat } from './helpers';
import { getAccountResources, getNestedType } from '../../utils/aptos';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { NetworkId } from '@sonarwatch/portfolio-core';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientAptos();
  const vaultsRate = await getAccountResources(connection, packageId);
  if (!vaultsRate) return;

  vaultsRate.forEach((resource) => {
    if (!resource.type.startsWith(vaultCollateralParamsFilter)) return;
    if (!resource.data) return;
    const vaultData = resource.data as VaultCollateralParamsRessource;
    if (!vaultData) return;
    cache.setItem(
      getNestedType(resource.type),
      fp64ToFloat(BigInt(vaultData.interest_annual_rate_ratio.v)),
      {
        prefix: `${platformId}-vaultsRates`,
      }
    );
  });
};

const job: Job = {
  id: `${platformId}-vaults-rates`,
  networkIds: [NetworkId.aptos],
  executor,
  labels: ['normal', NetworkId.aptos],
};
export default job;
