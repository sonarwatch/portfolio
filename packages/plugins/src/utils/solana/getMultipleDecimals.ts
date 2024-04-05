import { PublicKey } from '@solana/web3.js';
import { SolanaClient } from '../clients/types';
import { getMultipleDecimalsAsMap } from './getMultipleDecimalsAsMap';

export async function getMultipleDecimals(
  connection: SolanaClient,
  mints: PublicKey[]
): Promise<(number | null)[]> {
  const decimalsMap = await getMultipleDecimalsAsMap(connection, mints);
  return mints.map((m) => decimalsMap.get(m.toString()) || null);
}
