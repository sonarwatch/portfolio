import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { multipleGetDynamicFieldsObjects } from '../../utils/sui/multipleGetDynamicFieldsObjects';
import {
  dynamicFieldPositionType,
  platformId,
  vaultsInfo,
  vaultsInfoKey,
} from './constants';
import { Vault, VaultPosition, VaultPositionInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const [vaultsObjects, vaultsDynamicFields] = await Promise.all([
    multiGetObjects<Vault>(
      client,
      vaultsInfo.map((vault) => vault.id)
    ),
    multipleGetDynamicFieldsObjects(
      client,
      vaultsInfo.map((vault) => vault.id)
    ),
  ]);

  const vaultsInfos: VaultPositionInfo[] = [];
  for (let i = 0; i < vaultsObjects.length; i++) {
    const vault = vaultsObjects[i].data?.content?.fields;
    if (!vault) continue;

    const dynamicFields = vaultsDynamicFields[i];
    let vaultPosition;
    for (const fields of dynamicFields) {
      if (fields.data?.type === dynamicFieldPositionType)
        vaultPosition = fields.data.content?.fields as VaultPosition;
    }
    if (!vaultPosition) continue;

    const vaultPositionInfo: VaultPositionInfo = {
      id: vault.id.id,
      liquidity: vaultPosition.value.fields.liquidity,
      lowerTick: vault.lower_tick,
      upperTick: vault.upper_tick,
      totalSupply: vault.treasury_cap.fields.total_supply.fields.value,
    };
    vaultsInfos.push(vaultPositionInfo);
  }
  await cache.setItem(vaultsInfoKey, vaultsInfos, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-vaults`,
  executor,
  label: 'normal',
};
export default job;
