import { NetworkIdType } from './Network';
import { deepClone } from './helpers';

export const coingeckoSourceId = 'coingecko';
export const tokenPriceSourceTtl = 2 * 60 * 60 * 1000; // 2 hours
const MAX_N_SOURCES = 10;

export type TokenPriceUnderlying = {
  networkId: NetworkIdType;
  address: string;
  price: number;
  decimals: number;
  amountPerLp: number;
};

export type TokenPriceSource = {
  id: string;
  weight: number; // number between 0 and 1
  address: string;
  networkId: NetworkIdType;
  platformId: string;
  decimals: number;
  price: number;
  elementName?: string;
  underlyings?: TokenPriceUnderlying[];
  timestamp: number; // in ms
};

export type TokenPrice = {
  address: string;
  networkId: NetworkIdType;
  platformId: string;
  decimals: number;
  price: number;
  elementName?: string;
  underlyings?: TokenPriceUnderlying[];
  sources: TokenPriceSource[];
  timestamp: number; // in ms
};

export function tokenPriceFromSources(
  sources: TokenPriceSource[]
): TokenPrice | undefined {
  const updatedSources = updateTokenPriceSources(sources);
  if (!updatedSources || updatedSources.length === 0) return undefined;

  const latestSource = updatedSources.reduce((prev, current) =>
    prev.timestamp > current.timestamp ? prev : current
  );
  let price: number;
  const coingeckoSource = updatedSources.find(
    (source) => source.id === coingeckoSourceId
  );
  if (coingeckoSource) price = coingeckoSource.price;
  else {
    const [priceSum, weightSum] = updatedSources.reduce(
      ([cPriceSum, cWeightSum], source) => [
        cPriceSum + source.price * source.weight,
        cWeightSum + source.weight,
      ],
      [0, 0]
    );
    price = weightSum === 0 ? 0 : priceSum / weightSum;
  }
  return {
    address: latestSource.address,
    networkId: latestSource.networkId,
    platformId: latestSource.platformId,
    decimals: latestSource.decimals,
    price,
    underlyings: latestSource.underlyings,
    elementName: latestSource.elementName,
    timestamp: Date.now(),
    sources: updatedSources,
  };
}

export function pushTokenPriceSource(
  sources: TokenPriceSource[],
  source: TokenPriceSource
): TokenPriceSource[] | undefined {
  // Clone sources
  const newSources = deepClone(sources);

  // Push source
  const index = newSources.findIndex((s) => s.id === source.id);
  if (index === -1) newSources.push(source);
  else newSources[index] = source;

  return updateTokenPriceSources(newSources);
}

export function updateTokenPriceSources(
  sources: TokenPriceSource[]
): TokenPriceSource[] | undefined {
  if (sources.length === 0) return undefined;
  // Clone sources
  let newSources = deepClone(sources);

  // Remove too old sources
  const tsThreshold = Date.now() - tokenPriceSourceTtl;
  newSources = newSources.filter((source) => source.timestamp > tsThreshold);
  if (newSources.length === 0) return undefined;

  // Keep only MAX_N_SOURCES
  newSources.sort((sourceA, sourceB) => {
    if (sourceA.id === coingeckoSourceId) return -1;
    if (sourceB.id === coingeckoSourceId) return 1;
    return sourceB.weight - sourceA.weight;
  });
  newSources = newSources.slice(0, MAX_N_SOURCES);

  return newSources;
}

export function getTokenPriceUnderlyingFromTokenPrice(
  tokenPrice: TokenPrice,
  amountPerLp: number
): TokenPriceUnderlying {
  return { ...tokenPrice, amountPerLp };
}

export function getTokenPricesUnderlyingsFromTokensPrices(
  tokensPrices: TokenPrice[],
  amountsPerLp: number[]
): TokenPriceUnderlying[] {
  return tokensPrices.map((t, i) => ({
    address: t.address,
    decimals: t.decimals,
    networkId: t.networkId,
    price: t.price,
    amountPerLp: amountsPerLp[i],
  }));
}
