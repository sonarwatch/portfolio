import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';

import { ContractFunctionConfig, getAddress } from 'viem';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { morphoVaultsCachePrefix, platformId } from './constants';

import { getEvmClient } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { Cache } from '../../Cache';
import { MorphoVaultRes } from './types';
import { morphoVaultABI } from './utils/abis';
import { zeroBigInt } from '../../utils/misc/constants';

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
      contracts: vaults.map<ContractFunctionConfig<typeof morphoVaultABI>>(
        (vault) => ({
          abi: morphoVaultABI,
          address: getAddress(vault.address),
          functionName: 'balanceOf',
          args: [getAddress(owner)],
        })
      ),
    });

    const vaultsWithShares = [];
    for (let i = 0; i < vaults.length; i++) {
      const vault = vaults[i];
      const vaultBalance = vaultSharesRes[i];

      if (vaultBalance.error || vaultBalance.result === zeroBigInt) {
        continue;
      }
      vaultsWithShares.push({
        ...vault,
        shares: vaultBalance.result,
      });
    }

    if (vaultsWithShares.length === 0) {
      return [];
    }

    const vaultBalanceRes = await client.multicall({
      contracts: vaultsWithShares.map<
        ContractFunctionConfig<typeof morphoVaultABI>
      >((vault) => ({
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

      const element = elementRegistry.addElementMultiple({
        label: 'Yield',
        name: vault.name,
      });

      element.addAsset({
        address: vault.asset.address,
        amount: vaultRes.result.toString(),
      });
    }

    return elementRegistry.getElements(cache);
  };

  return {
    id: `${platformId}-${networkId}-vaults`,
    networkId,
    executor,
  };
}
