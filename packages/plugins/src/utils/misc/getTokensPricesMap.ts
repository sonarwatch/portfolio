import { NetworkIdType, TokenPrice } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import runInBatch from './runInBatch';

/**
 * @deprecated
 * This function has been deprecated. Use the cache.getTokenPricesAsMap() instead.
 */
export default async function getTokenPricesMap(
  tokensAddresses: string[],
  networkId: NetworkIdType,
  cache: Cache
): Promise<Map<string, TokenPrice>> {
  const tokensGroups = [];
  for (let i = 0; i < tokensAddresses.length; i += 10) {
    tokensGroups.push(tokensAddresses.slice(i, i + 10));
  }
  const tokenPriceById: Map<string, TokenPrice> = new Map();
  const res = await runInBatch(
    tokensGroups.map((group) => () => cache.getTokenPrices(group, networkId))
  );
  res.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    r.value.forEach((tokenPrice) => {
      if (tokenPrice) tokenPriceById.set(tokenPrice.address, tokenPrice);
    });
  });
  return tokenPriceById;
}
