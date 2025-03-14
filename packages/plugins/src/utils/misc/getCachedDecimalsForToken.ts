import { formatTokenAddress, NetworkIdType } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { MemoizedCache } from './MemoizedCache';
import { getDecimalsForToken } from './getDecimalsForToken';

type Decimal = number | null;
const ttl = 60 * 60 * 24;

const decimalsMemo: Map<string, MemoizedCache<Decimal>> = new Map();

/**
 * Return the decimals of a token on any network using RPC calls or TokenList.
 *
 * @param cache Cache where to look for decimals
 * @param address The mint/address of the token.
 * @param networkId The network on which to execute the request.
 *
 * @returns The number of decimals or undefined if unsuccessful request.
 */
export async function getCachedDecimalsForToken(
  cache: Cache,
  address: string,
  networkId: NetworkIdType
): Promise<Decimal> {
  const key = `${networkId}-${formatTokenAddress(address, networkId)}`;

  let decimalMemo = decimalsMemo.get(key);

  if (!decimalMemo) {
    decimalMemo = new MemoizedCache<Decimal>(
      formatTokenAddress(address, networkId),
      {
        prefix: 'decimalsfortoken',
        networkId,
      },
      undefined,
      ttl,
      async () => getDecimalsForToken(address, networkId)
    );
    decimalsMemo.set(key, decimalMemo);
  }

  return decimalMemo.getItem(cache);
}
