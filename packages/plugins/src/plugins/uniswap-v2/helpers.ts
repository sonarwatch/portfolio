import request, { gql } from 'graphql-request';

import { TheGraphUniV2Pair } from './types';

export function getPairKey(version: string) {
  return `pools-${version.toLowerCase()}`;
}

export async function getPairsV2FromTheGraph(url: string, length = 300) {
  const query = gql`
    {
      pairs(
        orderBy: reserveUSD
        first: ${length}
        orderDirection: desc
        where: { trackedReserveETH_not: "0" }
      ) {
        id
        reserve0
        reserve1
        totalSupply
        token0 {
          id
          decimals
        }
        token1 {
          id
          decimals
        }
      }
    }
  `;
  const res = await request<{ pairs: TheGraphUniV2Pair[] }>(url, query);
  const pairs = res.pairs as TheGraphUniV2Pair[];
  if (!pairs || !pairs.length) return [];
  return pairs;
}
