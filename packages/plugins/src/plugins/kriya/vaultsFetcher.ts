import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  platformId,
  vaultsInfo,
  vaultsInfoKey,
  vaultStakeReceipt,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { getMultipleBalances } from '../../utils/sui/mulitpleGetBalances';
import { VaultPositionInfo } from './types/common';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { VaultReceipt } from './types/vaults';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const vaultsPositionInfoMemo = new MemoizedCache<VaultPositionInfo[]>(
  vaultsInfoKey,
  {
    prefix: platformId,
    networkId: NetworkId.sui,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const [vaultsOldBalances, vaultBalances, vaultsPositionInfo] =
    await Promise.all([
      getMultipleBalances(
        client,
        owner,
        vaultsInfo.map((vault) => vault.tokenType)
      ),
      getOwnedObjectsPreloaded<VaultReceipt>(client, owner, {
        filter: { StructType: vaultStakeReceipt },
      }),
      vaultsPositionInfoMemo.getItem(cache),
    ]);

  if (!vaultsPositionInfo) return [];

  const vaultsByCoinType: Map<string, VaultPositionInfo> = new Map();
  vaultsPositionInfo.forEach((vault) =>
    vaultsByCoinType.set(vault.coinType, vault)
  );

  const vaultsByFarmId: Map<string, VaultPositionInfo> = new Map();
  vaultsPositionInfo.forEach((vault) =>
    vaultsByFarmId.set(vault.farmId, vault)
  );

  const registry = new ElementRegistry(NetworkId.sui, platformId);
  const liquidities = registry.addElementLiquidity({
    label: 'Vault',
  });
  for (let i = 0; i < vaultsOldBalances.length; i++) {
    const liquidity = liquidities.addLiquidity();
    const balance = vaultsOldBalances[i];
    if (balance.totalBalance === '0') continue;

    const vault = vaultsByCoinType.get(balance.coinType);
    if (!vault) continue;

    const totalSupply = new BigNumber(vault.totalSupply);

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      new BigNumber(vault.liquidity),
      vault.currentTickIndex,
      vault.lowerTick,
      vault.upperTick,
      false
    );

    const shares = new BigNumber(balance.totalBalance).dividedBy(totalSupply);

    const amountA = tokenAmountA.times(shares);
    const amountB = tokenAmountB.times(shares);

    liquidity.addAsset({
      address: vault.mintA,
      amount: amountA,
    });
    liquidity.addAsset({
      address: vault.mintB,
      amount: amountB,
    });
  }

  for (let i = 0; i < vaultBalances.length; i++) {
    const liquidity = liquidities.addLiquidity();
    const stakeReceipt = vaultBalances[i].data?.content?.fields;
    if (!stakeReceipt || stakeReceipt.shares === '0') continue;

    const vault = vaultsByFarmId.get(stakeReceipt.farm_id);
    if (!vault) continue;

    const totalSupply = new BigNumber(vault.totalSupply);

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      new BigNumber(vault.liquidity),
      600,
      vault.lowerTick,
      vault.upperTick,
      false
    );
    const useApiData = tokenAmountA.isLessThan(0) || tokenAmountB.isLessThan(0);

    const shares = new BigNumber(stakeReceipt.shares).dividedBy(totalSupply);

    const amountA = useApiData
      ? new BigNumber(vault.amountA).times(shares)
      : tokenAmountA.times(shares);
    const amountB = useApiData
      ? new BigNumber(vault.amountB).times(shares)
      : tokenAmountB.times(shares);

    liquidity.addAsset({
      address: vault.mintA,
      amount: amountA,
    });
    liquidity.addAsset({
      address: vault.mintB,
      amount: amountB,
    });
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-vaults`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
