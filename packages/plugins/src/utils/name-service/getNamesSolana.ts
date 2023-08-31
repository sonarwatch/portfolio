import { PublicKey } from '@solana/web3.js';
import { getFavoriteDomain } from '@bonfida/spl-name-service';
import { getClientSolana } from '../clients';

export async function getNamesSolana(address: string): Promise<string[]> {
  const client = getClientSolana();
  const owner = new PublicKey(address);

  const { reverse } = await getFavoriteDomain(client, owner).catch(() => ({
    reverse: null,
  }));
  if (!reverse) return [];
  return [`${reverse}.sol`];
}
