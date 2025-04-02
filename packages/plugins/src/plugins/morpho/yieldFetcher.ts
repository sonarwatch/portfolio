import { EvmNetworkIdType, NetworkId } from '@sonarwatch/portfolio-core';

import { getAddress } from 'viem';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { morphoVaultsCachePrefix, platformId } from './constants';

import { getEvmClient } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { Cache } from '../../Cache';
import { MorphoVaultRes } from './types';
import { morphoVaultABI } from './utils/abis';

export function getYieldFetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const vaults = await cache.getItem<MorphoVaultRes['vaults']['items']>(
      morphoVaultsCachePrefix,
      {
        networkId,
        prefix: morphoVaultsCachePrefix,
      }
    );
    if (!vaults || vaults.length === 0) {
      return [];
    }

    const client = getEvmClient(networkId);

    const vaultSharesRes = await client.multicall({
      contracts: vaults.map((vault) => ({
        abi: morphoVaultABI,
        address: getAddress(vault.address),
        functionName: 'balanceOf',
        args: [owner],
      })),
    });

    const vaultsWithShares = [];
    for (let i = 0; i < vaults.length; i++) {
      const vault = vaults[i];
      const vaultBalance = vaultSharesRes[i];

      if (vaultBalance.error || (vaultBalance.result as bigint) === BigInt(0)) {
        continue;
      }
      vaultsWithShares.push({
        ...vault,
        shares: vaultBalance.result as bigint,
      });
    }

    const vaultBalanceRes = await client.multicall({
      contracts: vaultsWithShares.map((vault) => ({
        abi: morphoVaultABI,
        address: getAddress(vault.address),
        functionName: 'convertToAssets',
        args: [vault.shares],
      })),
    });

    const elementRegistry = new ElementRegistry(networkId, platformId);

    for (let i = 0; i < vaultsWithShares.length; i++) {
      const vaultRes = vaultBalanceRes[i];
      const vault = vaultsWithShares[i];

      if (vaultRes.error) {
        continue;
      }

      /*
        Note:
        This is actually a yield position,
        Im not sure how to label it properly
     */
      const element = elementRegistry.addElementMultiple({
        label: 'Deposit',
        name: vault.name,
      });

      element.addAsset({
        address: vault.asset.address,
        amount: (vaultRes.result as bigint).toString(),
      });
    }

    return elementRegistry.getElements(cache);
  };

  return {
    id: `${platformId}-${networkId}-vaults`,
    networkId: NetworkId.ethereum,
    executor,
  };
}
