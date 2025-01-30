import request, { gql } from 'graphql-request';
import { Pool, PoolApiResponse } from '../types';
import {
  BalancerSupportedEvmNetworkIdType,
  balancerApiNetworkByNetworkId,
} from '../constants';

const balancerApiUrl = 'https://api-v3.balancer.fi';

export async function getBalancerPoolsV2FromGraph(
  url: string
): Promise<Pool[]> {
  const query = gql`
    query pools {
      pools(
        first: 1000
        orderBy: totalLiquidity
        orderDirection: desc
        where: { totalLiquidity_gt: "500" }
      ) {
        id
        address
        symbol
        totalLiquidity
        totalShares
        tokens {
          balance
          decimals
          symbol
          address
        }
      }
    }
  `;
  const res = await request<{ pools: Pool[] }>(url, query);
  const pools = res.pools as Pool[];
  if (!pools || !pools.length) return [];
  return pools;
}
export async function getBalancerPoolsV2FromAPI(
  networkId: BalancerSupportedEvmNetworkIdType
): Promise<Pool[]> {
  const balancerApiNetwork = balancerApiNetworkByNetworkId[networkId];
  const query = gql`
    query {
      poolGetPools(
        where: { chainIn: [${balancerApiNetwork}], minTvl: 500 }
        orderBy: totalLiquidity
        first: 1000
        orderDirection: desc
      ) {
        id
        address
        symbol
        dynamicData {
          totalLiquidity
          totalShares
        }
        tokens: poolTokens {
          balance
          decimals
          symbol
          address
        }
      }
    }
  `;

  try {
    const res = await request<{ poolGetPools: PoolApiResponse[] }>(
      balancerApiUrl,
      query
    );
    const pools = res.poolGetPools;
    if (!pools || !pools.length) return [];

    const fPools = pools.map((pool) => ({
      id: pool.id,
      address: pool.address,
      symbol: pool.symbol,
      totalLiquidity: pool.dynamicData.totalLiquidity,
      totalShares: pool.dynamicData.totalShares,
      tokens: pool.tokens,
    }));

    console.log(networkId, fPools.length);

    return fPools;
  } catch (error) {
    console.error('Error fetching Balancer pools:', error);
    return [];
  }
}
