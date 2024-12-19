import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  platformId,
  strategyLpRebalancingInfoKey,
  strategyLpRebalancingStakeReceipt,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { getMultipleBalances } from '../../utils/sui/mulitpleGetBalances';
import { VaultPositionInfo } from './types/common';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { VaultReceipt } from './types/vaults';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';
import { arrayToMap } from '../../utils/misc/arrayToMap';

const vaultsPositionInfoMemo = new MemoizedCache<VaultPositionInfo[]>(
  strategyLpRebalancingInfoKey,
  {
    prefix: platformId,
    networkId: NetworkId.sui,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const vaultsPositionInfo = await vaultsPositionInfoMemo.getItem(cache);

  if (!vaultsPositionInfo) return [];

  const [vaultsOldBalances, vaultBalances] = await Promise.all([
    getMultipleBalances(
      client,
      owner,
      vaultsPositionInfo.map((v) => v.coinType)
    ),
    getOwnedObjectsPreloaded<VaultReceipt>(client, owner, {
      filter: { StructType: strategyLpRebalancingStakeReceipt },
    }),
  ]);

  const vaultsByCoinType = arrayToMap(vaultsPositionInfo, 'coinType');
  const vaultsByFarmId = arrayToMap(vaultsPositionInfo, 'farmId');

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
  id: `${platformId}-strategy-lp-rebalancing`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
