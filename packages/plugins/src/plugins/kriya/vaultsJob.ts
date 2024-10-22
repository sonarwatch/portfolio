import { NetworkId, parseTypeString } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import {
  dynamicFieldPositionTypeCetus,
  dynamicFieldPositionTypeKriya,
  platformId,
  vaultsInfo,
  vaultsInfoKey,
  vaultsUrl,
} from './constants';
import {
  Vault,
  VaultData,
  VaultPositionCetus,
  VaultPositionKriya,
} from './types/vaults';
import { Dex, VaultPositionInfo } from './types/common';
import { ClmmPool as KriyaPool } from './types/pools';
import { getObject } from '../../utils/sui/getObject';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';
import { CetusPool } from '../cetus/types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const vaultsInfos: VaultPositionInfo[] = [];

  const vaultsApiData: AxiosResponse<VaultData[]> = await axios.get(vaultsUrl);

  for (const vaultInfo of vaultsInfo) {
    const [vaultOject, vaultDynamicFields] = await Promise.all([
      getObject<Vault>(client, vaultInfo.id),
      getDynamicFieldObjects(client, vaultInfo.id),
    ]);

    const vault = vaultOject.data?.content?.fields;
    if (!vault) continue;

    const vaultData = vaultsApiData.data.find((v) => v.id === vault.id.id);
    if (!vaultData) continue;

    const isCetus = vaultInfo.underlyingDex === Dex.cetus;
    const dynamicFieldType = isCetus
      ? dynamicFieldPositionTypeCetus
      : dynamicFieldPositionTypeKriya;
    let vaultPosition;
    for (const fields of vaultDynamicFields) {
      if (fields.data?.type === dynamicFieldType) {
        vaultPosition = isCetus
          ? (fields.data.content?.fields as VaultPositionCetus)
          : (fields.data.content?.fields as VaultPositionKriya);
      }
    }
    if (!vaultPosition) continue;

    const vaultPositionCommon = {
      id: vault.id.id,
      farmId: vaultData.farmId,
      coinType: vaultInfo.tokenType,
      liquidity: vaultPosition.value.fields.liquidity,
      lowerTick: vault.lower_tick,
      upperTick: vault.upper_tick,
      totalSupply: vault.treasury_cap.fields.total_supply.fields.value,
      amountA: vaultData.coinA,
      amountB: vaultData.coinB,
    };

    if (vaultInfo.underlyingDex === Dex.cetus) {
      const poolInfo = await getObject<CetusPool>(
        client,
        vaultInfo.underlyingPool
      );
      if (poolInfo.data?.content?.fields) {
        const { keys } = parseTypeString(poolInfo.data.type);

        if (keys && keys.at(0) && keys.at(1)) {
          const vaultPositionInfo: VaultPositionInfo = {
            ...vaultPositionCommon,
            currentTickIndex: bitsToNumber(
              poolInfo.data.content.fields.current_tick_index.fields.bits
            ),
            mintA: keys[0].type,
            mintB: keys[1].type,
          };
          vaultsInfos.push(vaultPositionInfo);
        }
      }
    } else if (vaultInfo.underlyingDex === Dex.kriya) {
      const poolInfo = await getObject<KriyaPool>(
        client,
        vaultInfo.underlyingPool
      );
      if (poolInfo.data?.content?.fields) {
        const vaultPositionInfo: VaultPositionInfo = {
          ...vaultPositionCommon,
          currentTickIndex: bitsToNumber(
            poolInfo.data.content.fields.tick_index.fields.bits
          ),
          mintA: poolInfo.data.content.fields.type_x.fields.name,
          mintB: poolInfo.data.content.fields.type_y.fields.name,
        };
        vaultsInfos.push(vaultPositionInfo);
      }
    }
  }

  await cache.setItem(vaultsInfoKey, vaultsInfos, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-vaults`,
  executor,
  label: 'realtime',
};
export default job;
