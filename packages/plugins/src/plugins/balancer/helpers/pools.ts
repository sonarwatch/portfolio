import request, { gql } from 'graphql-request';
import { Pool } from '../types';

export async function getBalancerPoolsV2(url: string) {
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
