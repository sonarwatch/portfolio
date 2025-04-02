import request, { gql } from 'graphql-request';
import { EvmNetworkIdType, networks } from '@sonarwatch/portfolio-core';
import { morphoApiUrl } from '../constants';
import { MorphoMarketRes, MorphoVaultRes } from '../types';

export async function getMarkets(networkId: EvmNetworkIdType) {
  const query = gql`
    query Markets($first: Int, $where: MarketFilters) {
      markets(first: $first, where: $where) {
        items {
          uniqueKey
          loanAsset {
            address
            decimals
            logoURI
            name
            priceUsd
            symbol
          }
          collateralAsset {
            address
            decimals
            logoURI
            name
            priceUsd
            symbol
          }
        }
      }
    }
  `;

  const variables = {
    first: 1000,
    where: {
      chainId_in: networks[networkId].chainId,
      // review if this is the best heuristic for good markets
      supplyAssetsUsd_gte: 1,
      borrowAssetsUsd_gte: 1,
    },
  };

  try {
    const res = await request<MorphoMarketRes>(morphoApiUrl, query, variables);

    return res.markets.items;
  } catch (error) {
    const msg = 'Cannot get Morpho markets';
    console.error(msg, error);
    return [];
  }
}

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
