import { NetworkId, parseTypeString } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import {
  dynamicFieldPositionTypeCetus,
  dynamicFieldPositionTypeKriya,
  platformId,
  strategyLpRebalancingInfoKey,
  strategyLpRebalancingUrl,
} from './constants';
import {
  APIResponseVault,
  Vault,
  VaultPositionCetus,
  VaultPositionKriya,
} from './types/vaults';
import { VaultPositionInfo } from './types/common';
import { ClmmPool as KriyaPool } from './types/pools';
import { getObject } from '../../utils/sui/getObject';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';
import { CetusPool } from '../cetus/types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const vaultsInfos: VaultPositionInfo[] = [];

  const vaultsApiData: AxiosResponse<APIResponseVault> = await axios.get(
    strategyLpRebalancingUrl
  );

  for (const vaultData of vaultsApiData.data.data) {
    const [vaultOject, vaultDynamicFields] = await Promise.all([
      getObject<Vault>(client, vaultData.vaultId),
      getDynamicFieldObjects(client, vaultData.vaultId),
    ]);

    const vault = vaultOject.data?.content?.fields;
    if (!vault) continue;

    const isCetus = vaultData.vaultSource === 'Cetus';
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
    if (
      !vaultPosition ||
      !vaultData.farm ||
      !vaultData.info.type ||
      !vaultData.info.tokenXAmount ||
      !vaultData.info.tokenYAmount
    )
      continue;

    const vaultPositionCommon = {
      id: vault.id.id,
      farmId: vaultData.farm.id,
      coinType: vaultData.info.type,
      liquidity: vaultPosition.value.fields.liquidity,
      lowerTick: vault.lower_tick,
      upperTick: vault.upper_tick,
      totalSupply: vault.treasury_cap.fields.total_supply.fields.value,
      amountA: vaultData.info.tokenXAmount,
      amountB: vaultData.info.tokenYAmount,
    };
    if (vaultData.info.pool?.poolId) {
      if (isCetus) {
        const poolInfo = await getObject<CetusPool>(
          client,
          vaultData.info.pool.poolId
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
      } else if (vaultData.vaultSource === 'Kriya') {
        const poolInfo = await getObject<KriyaPool>(
          client,
          vaultData.info.pool.poolId
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
  }

  await cache.setItem(strategyLpRebalancingInfoKey, vaultsInfos, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-strategy-lp-rebalancing`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['realtime', NetworkId.sui],
};
export default job;
