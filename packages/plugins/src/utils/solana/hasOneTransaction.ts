import { PublicKey } from '@solana/web3.js';
import { assertSolanaAddress } from '@sonarwatch/portfolio-core';
import { getClientSolana } from '../clients';

export async function hasOneTransaction(address: string): Promise<boolean> {
  assertSolanaAddress(address);
  const client = getClientSolana();
  const tx = await client.getSignaturesForAddress(new PublicKey(address), {
    limit: 1,
  });
  return !(tx.length === 0);
}
