import request, { gql } from 'graphql-request';
import BigNumber from 'bignumber.js';
import { TheGraphSushiV3Pair } from './types';
import { UniV2Pair } from '../uniswap-v2/types';

function sushiV3PairToUniV2(pair: TheGraphSushiV3Pair): UniV2Pair {
  return {
    id: pair.id,
    reserve0: new BigNumber(pair.token0.totalSupply).div(10 ** 18).toString(),
    reserve1: pair.token1.totalSupply,
    token0: {
      id: pair.token0.id,
    },
    token1: {
      id: pair.token1.id,
    },
    totalSupply: pair.liquidity,
  };
}

export async function getV3PairsAddresses(url: string, length = 300) {
  const query = gql`
    {
      pools(
        orderBy: totalValueLockedUSD
        first: ${length}
        orderDirection: desc
        where: { volumeUSD_not: "0", liquidity_not: "0"  }
      ) {
        id
        token0Price
        token1Price
        liquidity
        token0 {
          id
          totalSupply
          decimals
        }
        token1 {
          id
          totalSupply
          decimals
        }
      }
    }
  `;
  const res = await request<{ pools: TheGraphSushiV3Pair[] }>(url, query);
  const pools = res.pools as TheGraphSushiV3Pair[];
  if (!pools || !pools.length) return [];

  return pools.map((p) => sushiV3PairToUniV2(p));
}
