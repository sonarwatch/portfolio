import { PublicKey } from '@solana/web3.js';
import { assertSolanaAddress } from '@sonarwatch/portfolio-core';
import { getClientSolana } from '../clients';
import { Cache } from '../../Cache';

export async function isSolanaAddressActive(
  cache: Cache,
  address: string
): Promise<boolean> {
  assertSolanaAddress(address);
  const isActiveFromCache = await cache.getItem<boolean>(address, {
    prefix: 'isActive',
  });
  if (isActiveFromCache) return true;

  const client = getClientSolana();
  const tx = await client.getSignaturesForAddress(new PublicKey(address), {
    limit: 1,
  });

  if (tx.length === 0) {
    return false;
  }
  await cache.setItem(address, true, {
    prefix: 'isActive',
    ttl: 60 * 60 * 24 * 30, // 30 days
  });

  return true;
}
