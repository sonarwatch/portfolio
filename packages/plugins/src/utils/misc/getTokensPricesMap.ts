import { NetworkIdType, TokenPrice } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';

export default async function getTokenPricesMap(
  tokensAddresses: string[],
  networkId: NetworkIdType,
  cache: Cache
): Promise<Map<string, TokenPrice>> {
  const tokensPrices = await cache.getTokenPrices(tokensAddresses, networkId);
  const tokenPriceById: Map<string, TokenPrice> = new Map();
  tokensPrices.forEach((tP, index) =>
    tP ? tokenPriceById.set(tokensAddresses[index], tP) : undefined
  );
  return tokenPriceById;
}
