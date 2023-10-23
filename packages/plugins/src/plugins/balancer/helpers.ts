import {
  NetworkIdType,
  TokenPrice,
  TokenPriceSource,
  TokenPriceUnderlying,
  formatTokenAddress,
} from '@sonarwatch/portfolio-core';
import request, { gql } from 'graphql-request';
import BigNumber from 'bignumber.js';
import { Pool } from './types';
import { Cache } from '../../Cache';
import { platformId, poolsCacheKey } from './constants';
import runInBatch from '../../utils/misc/runInBatch';

export async function getBalancerPools(
  url: string,
  networkId: NetworkIdType,
  cache: Cache
) {
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
  if (!pools || !pools.length) return;

  const underlyingAddresses = [
    ...new Set(pools.map((p) => p.tokens.map((t) => t.address)).flat()),
  ];

  const tokenPriceResults = await runInBatch(
    [...underlyingAddresses].map(
      (mint) => () => cache.getTokenPrice(mint, networkId)
    )
  );
  const tokenPricesByAddress: Map<string, TokenPrice> = new Map();
  tokenPriceResults.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPricesByAddress.set(r.value.address, r.value);
  });

  const poolAddresses: string[] = [];
  for (let i = 0; i < pools.length; i++) {
    const pool = pools[i];
    if (!pool.address || !pool.tokens || !pool.id) continue;

    const underlyings: TokenPriceUnderlying[] = [];
    let tvl = new BigNumber(0);
    for (let j = 0; j < pool.tokens.length; j++) {
      const token = pool.tokens[j];
      const address = formatTokenAddress(token.address, networkId);
      const tokenPrice = tokenPricesByAddress.get(address);
      if (!tokenPrice) break;
      tvl = tvl.plus(new BigNumber(token.balance).times(token.balance));
      underlyings.push({
        networkId,
        address,
        decimals: token.decimals,
        price: tokenPrice.price,
        amountPerLp: new BigNumber(pool.totalLiquidity)
          .div(token.balance)
          .toNumber(),
      });
    }
    if (underlyings.length !== pool.tokens.length) continue;
    if (underlyings.length === 0) continue;

    const price = tvl.div(pool.totalLiquidity).toNumber();
    const lpAddress = formatTokenAddress(pool.address, networkId);
    const source: TokenPriceSource = {
      id: platformId,
      address: lpAddress,
      decimals: 18,
      networkId,
      platformId: 'balancer',
      price,
      timestamp: Date.now(),
      weight: 1,
      elementName: 'Balancer V2',
      underlyings,
    };
    await cache.setTokenPriceSource(source);
    poolAddresses.push(lpAddress);
  }
  await cache.setItem(poolsCacheKey, poolAddresses, {
    prefix: platformId,
    networkId,
  });
}
