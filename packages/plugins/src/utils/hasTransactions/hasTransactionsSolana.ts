import { PublicKey } from '@solana/web3.js';
import { SolanaClient } from '../clients/types';

export async function hasTransactionsSolana(
  address: string,
  connection: SolanaClient
): Promise<boolean> {
  const pk = new PublicKey(address);
  const tx = await connection.getSignaturesForAddress(pk, {
    limit: 1,
  });
  return tx.length !== 0;
}
