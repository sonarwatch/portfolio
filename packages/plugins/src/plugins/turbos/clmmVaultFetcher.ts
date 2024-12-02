import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { clmmPoolsPrefix, platformId, vaultPackageId } from './constants';
import { getClientSui } from '../../utils/clients';
import {
  VaultStrategy,
  VaultPositionNFT,
  VaultInfo,
  PositionFields,
  Pool,
} from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { multiDynamicFieldObjects } from '../../utils/sui/multiDynamicFieldObjects';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const vaultNftPositionObjects =
    await getOwnedObjectsPreloaded<VaultPositionNFT>(client, owner, {
      filter: {
        Package: vaultPackageId,
      },
    });

  if (vaultNftPositionObjects.length === 0) return [];

  const vaultsStrat: Set<string> = new Set();
  const vaultsInfoByStrat: Map<string, string[]> = new Map();
  vaultNftPositionObjects.forEach((pos) => {
    if (pos.data?.content) {
      vaultsStrat.add(pos.data.content.fields.strategy_id);
      const vaultsInfo = vaultsInfoByStrat.get(
        pos.data.content.fields.strategy_id
      );
      if (vaultsInfo) {
        vaultsInfo.push(pos.data.content.fields.id.id);
      } else {
        vaultsInfoByStrat.set(pos.data.content.fields.strategy_id, [
          pos.data.content.fields.id.id,
        ]);
      }
    }
  });

  const vaultStratObjects = await multiGetObjects<VaultStrategy>(
    client,
    Array.from(vaultsStrat),
    {
      showContent: true,
    }
  );
  const vaultStratById: Map<string, VaultStrategy> = new Map();
  const vaultsStratIds: string[] = [];
  const poolIds: string[] = [];
  vaultStratObjects.forEach((vault) => {
    if (vault.data?.content) {
      const vaultsInfo = vaultsInfoByStrat.get(vault.data.objectId);
      if (vaultsInfo) {
        vaultsInfoByStrat.set(
          vault.data.content.fields.vaults.fields.id.id,
          vaultsInfo
        );
        vaultsInfoByStrat.delete(vault.data.objectId);
      }
      vaultStratById.set(vault.data.objectId, vault.data.content.fields);
      vaultsStratIds.push(vault.data.content.fields.vaults.fields.id.id);
      poolIds.push(vault.data.content.fields.clmm_pool_id);
    }
  });

  const pools = await cache.getItems<Pool>(poolIds, {
    prefix: clmmPoolsPrefix,
    networkId: NetworkId.sui,
  });
  if (pools.length === 0) return [];

  const poolsById: Map<string, Pool> = new Map();
  pools.forEach((pool) => {
    if (pool) {
      poolsById.set(pool.objectId, pool);
    }
  });

  const promises = [];
  for (const strat of vaultsInfoByStrat.keys()) {
    const vaultsInfo = vaultsInfoByStrat.get(strat);
    if (!vaultsInfo) continue;

    promises.push(
      multiDynamicFieldObjects<VaultInfo>(client, {
        parentId: strat,
        type: '0x2::object::ID',
        values: vaultsInfo,
      })
    );
  }

  const vaultsInfoObj = (await Promise.all(promises)).flat();
  if (vaultsInfoObj.length === 0) return [];

  const vaultInfoById: Map<string, VaultInfo> = new Map();
  vaultsInfoObj.forEach((vault) => {
    if (vault.data?.content) {
      vaultInfoById.set(vault.data.objectId, vault.data.content.fields);
    }
  });
  const clmmPositions = vaultsInfoObj
    .map(
      (vault) =>
        vault.data?.content?.fields.value.fields.value.fields
          .base_clmm_position_id || []
    )
    .flat();
  const clmmPositionsObjects = await multiGetObjects<PositionFields>(
    client,
    clmmPositions,
    {
      showContent: true,
    }
  );
  const clmmPositionById: Map<string, PositionFields> = new Map();
  clmmPositionsObjects.forEach((vault) => {
    if (!vault.data?.content) return;
    clmmPositionById.set(vault.data?.objectId, vault.data.content.fields);
  });

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);
  for (const vaultInfoObject of vaultsInfoObj) {
    if (!vaultInfoObject.data?.content) continue;

    const vaultInfo =
      vaultInfoObject.data.content.fields.value.fields.value.fields;
    const pool = vaultStratById.get(vaultInfo.strategy_id);
    const clmmPosition = clmmPositionById.get(vaultInfo.base_clmm_position_id);
    if (!pool || !clmmPosition) continue;

    const element = elementRegistry.addElementConcentratedLiquidity({
      label: 'Vault',
    });
    element.setLiquidity({
      addressA: vaultInfo.coin_a_type_name.fields.name,
      addressB: vaultInfo.coin_b_type_name.fields.name,
      liquidity: clmmPosition.liquidity,
      tickCurrentIndex: bitsToNumber(
        vaultInfo.base_last_tick_index.fields.bits
      ),
      tickLowerIndex: bitsToNumber(clmmPosition.tick_lower_index.fields.bits),
      tickUpperIndex: bitsToNumber(clmmPosition.tick_upper_index.fields.bits),
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-clmm-vault`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
