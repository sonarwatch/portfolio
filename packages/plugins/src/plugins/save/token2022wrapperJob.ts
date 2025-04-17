import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { platformId, marketsKey } from './constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { MarketInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const markets = await cache.getItem<MarketInfo[]>(marketsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!markets) return;

  const wrappers: Map<string, string> = new Map();

  markets.forEach((market) => {
    market.reserves.forEach((reserve) => {
      if (reserve.liquidityToken.token2022Mint) {
        wrappers.set(
          reserve.liquidityToken.mint,
          reserve.liquidityToken.token2022Mint
        );
      }
    });
  });

  if (wrappers.size === 0) return;

  const tokenPrices = await cache.getTokenPricesAsMap(
    [...wrappers.values()],
    NetworkId.solana
  );

  const sources: TokenPriceSource[] = [];
  wrappers.forEach((token2022Mint, mint) => {
    const tokenPrice = tokenPrices.get(token2022Mint);
    if (!tokenPrice) return;

    sources.push({
      address: mint,
      decimals: tokenPrice.decimals,
      id: platformId,
      networkId: NetworkId.solana,
      platformId,
      price: tokenPrice.price,
      timestamp: Date.now(),
      weight: 1,
      underlyings: [
        {
          address: token2022Mint,
          decimals: tokenPrice.decimals,
          amountPerLp: 1,
          networkId: NetworkId.solana,
          price: tokenPrice.price,
        },
      ],
    });
  });

  if (sources.length === 0) return;

  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-token2002wrapper`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
