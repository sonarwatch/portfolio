import {
  EvmNetworkIdType,
  NetworkId,
  networks,
} from '@sonarwatch/portfolio-core';
import request, { gql } from 'graphql-request';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { morphoApiUrl, platformId } from './constants';

import { MorphoMarketRes } from './types';

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
    const msg = 'Cannot get Morpho vaults';
    console.error(msg, error);
    return [];
  }
}

function getYieldFetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (
    owner: string
    // cache: Cache
  ) => {
    console.log(owner, networkId);
    return [];
  };

  return {
    id: `${platformId}-vaults`,
    networkId: NetworkId.ethereum,
    executor,
  };
}

export default getYieldFetcher;
