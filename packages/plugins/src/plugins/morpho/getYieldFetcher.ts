import {
  EvmNetworkIdType,
  NetworkId,
  networks,
} from '@sonarwatch/portfolio-core';
import request, { gql } from 'graphql-request';
import { getAddress } from 'viem';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { morphoApiUrl, platformId } from './constants';

import { MorphoVaultRes } from './types';
import { morphoVaultABI } from './abis';
import { getEvmClient } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { Cache } from '../../Cache';

export async function getVaults(networkId: EvmNetworkIdType) {
  const query = gql`
    query Vaults($first: Int, $orderBy: VaultOrderBy, $where: VaultFilters) {
      vaults(first: $first, orderBy: $orderBy, where: $where) {
        items {
          address
          asset {
            address
            decimals
            logoURI
            name
            priceUsd
            symbol
          }
          symbol
          name
        }
      }
    }
  `;

  const variables = {
    first: 1000,
    orderBy: 'TotalAssetsUsd',
    where: {
      // totalAssetsUsd_gte: 1,
      chainId_in: networks[networkId].chainId,
    },
  };

  try {
    const res = await request<MorphoVaultRes>(morphoApiUrl, query, variables);

    return res.vaults.items;
  } catch (error) {
    const msg = 'Cannot get Morpho vaults';
    console.error(msg, error);
    return [];
  }
}

function getYieldFetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const vaults = await getVaults(networkId);

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
    id: `${platformId}-vaults`,
    networkId: NetworkId.ethereum,
    executor,
  };
}

export default getYieldFetcher;
