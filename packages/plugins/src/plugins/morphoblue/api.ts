import request, { gql } from 'graphql-request';
import { EvmNetworkIdType, networks } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { MorphoMarketRes, MorphoRewardsRes, MorphoVaultRes } from './types';
import { morphoApiUrl, morphoRewardsApiUrl } from './constants';
import { deepLog } from '../../utils/misc/logging';

export async function getMarkets(networkId: EvmNetworkIdType) {
  const query = gql`
    query Markets($first: Int, $where: MarketFilters, $skip: Int) {
      markets(first: $first, where: $where, skip: $skip) {
        pageInfo {
          count
          countTotal
          skip
        }
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
      supplyAssetsUsd_gte: 1,
      borrowAssetsUsd_gte: 1,
    },
    skip: 0,
  };

  let allItems: MorphoMarketRes['markets']['items'] = [];
  let hasMore = true;

  try {
    while (hasMore) {
      const res = await request<MorphoMarketRes>(
        morphoApiUrl,
        query,
        variables
      );

      allItems = [...allItems, ...res.markets.items];

      if (res.markets.items.length < variables.first) {
        hasMore = false;
      } else {
        variables.skip += variables.first;
      }
    }

    return allItems;
  } catch (error) {
    const msg = 'Cannot get Morpho markets';
    console.error(msg, error);
    return [];
  }
}

export async function getVaults(networkId: EvmNetworkIdType) {
  const query = gql`
    query Vaults(
      $first: Int
      $orderBy: VaultOrderBy
      $where: VaultFilters
      $skip: Int
    ) {
      vaults(first: $first, orderBy: $orderBy, where: $where, skip: $skip) {
        pageInfo {
          count
          countTotal
          skip
        }
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
    first: 50,
    orderBy: 'TotalAssetsUsd',
    where: {
      chainId_in: networks[networkId].chainId,
    },
    skip: 0,
  };

  let allItems: MorphoVaultRes['vaults']['items'] = [];
  let hasMore = true;

  try {
    while (hasMore) {
      const res = await request<MorphoVaultRes>(morphoApiUrl, query, variables);

      allItems = [...allItems, ...res.vaults.items];

      if (res.vaults.items.length < variables.first) {
        hasMore = false;
      } else {
        variables.skip += variables.first;
      }
    }

    return allItems;
  } catch (error) {
    const msg = 'Cannot get Morpho vaults';
    console.error(msg, error);
    return [];
  }
}

export async function getRewards(
  owner: string,
  networkId: EvmNetworkIdType
): Promise<MorphoRewardsRes> {
  try {
    const { data: rewardsRes } = await axios.get<MorphoRewardsRes>(
      `${morphoRewardsApiUrl}/users/${owner}/rewards`,
      {
        params: {
          chain_id: networks[networkId].chainId,
        },
        headers: {
          accept: 'application/json',
        },
      }
    );

    console.log(deepLog(rewardsRes));

    return rewardsRes;
  } catch (error) {
    const msg = 'Cannot get Morpho rewards';
    console.error(msg, error);
    throw new Error(msg);
  }
}
