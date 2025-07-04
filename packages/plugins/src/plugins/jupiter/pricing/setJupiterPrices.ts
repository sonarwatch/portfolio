import {
  jupiterSourceId,
  NetworkId,
  TokenPriceSource,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { getJupiterPrices } from './getJupiterPrices';

export async function setJupiterPrices(mints: string[], cache: Cache) {
  const assets = await getJupiterPrices(mints);

  const sources: TokenPriceSource[] = [];
  assets.forEach((asset, mint) => {
    const source: TokenPriceSource = {
      address: mint,
      decimals: asset.decimals,
      id: jupiterSourceId,
      networkId: NetworkId.solana,
      timestamp: Date.now(),
      price: asset.usdPrice,
      priceChange24h: asset.priceChange24h
        ? asset.priceChange24h / 100
        : undefined,
      platformId: walletTokensPlatformId,
      weight: 1,
    };
    sources.push(source);
  });

  await cache.setTokenPriceSources(sources);
}
