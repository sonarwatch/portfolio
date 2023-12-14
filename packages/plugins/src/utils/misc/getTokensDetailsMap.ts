import { NetworkIdType } from '@sonarwatch/portfolio-core';
import { Token } from '../../plugins/tokens/types';
import { Cache } from '../../Cache';
import { tokenListsDetailsPrefix } from '../../plugins/tokens/constants';

export default async function getTokensDetailsMap(
  tokensAddresses: string[],
  networkId: NetworkIdType,
  cache: Cache
): Promise<Map<string, Token>> {
  const mints: Set<string> = new Set();
  tokensAddresses.forEach((mint) => mints.add(mint));
  const tokensDetails = await cache.getItems<Token>(Array.from(mints), {
    prefix: tokenListsDetailsPrefix,
    networkId,
  });
  const tokenPriceById: Map<string, Token> = new Map();
  tokensDetails.forEach((tD) =>
    tD ? tokenPriceById.set(tD.address, tD) : undefined
  );
  return tokenPriceById;
}
