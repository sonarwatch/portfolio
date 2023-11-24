import { NetworkIdType, TokenPrice } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';

export default async function getTokenPricesMap(
  tokensAddresses: string[],
  networkId: NetworkIdType,
  cache: Cache
): Promise<Map<string, TokenPrice>> {
  const mints: Set<string> = new Set();
  tokensAddresses.forEach((mint) => mints.add(mint));
  const tokensPrices = await cache.getTokenPrices(Array.from(mints), networkId);
  const tokenPriceById: Map<string, TokenPrice> = new Map();
  tokensPrices.forEach((tP) =>
    tP ? tokenPriceById.set(tP.address, tP) : undefined
  );
  return tokenPriceById;
}
