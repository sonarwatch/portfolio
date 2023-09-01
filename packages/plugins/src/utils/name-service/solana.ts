import { PublicKey } from '@solana/web3.js';
import {
  NameRegistryState,
  getDomainKeySync,
  getFavoriteDomain,
} from '@bonfida/spl-name-service';
import { getClientSolana } from '../clients';

export function isSolanaName(name: string): boolean {
  return name.endsWith('.sol');
}

export async function getOwnerSolana(name: string): Promise<string | null> {
  const client = getClientSolana();
  const domainName = name.slice(0, -4);
  const { pubkey } = getDomainKeySync(domainName);
  const { registry, nftOwner } = await NameRegistryState.retrieve(
    client,
    pubkey
  ).catch(() => ({ registry: null, nftOwner: null }));
  if (nftOwner) return nftOwner.toString();
  if (registry) return registry.owner.toString();
  return null;
}

export async function getNamesSolana(address: string): Promise<string[]> {
  const client = getClientSolana();
  const owner = new PublicKey(address);

  const { reverse } = await getFavoriteDomain(client, owner).catch(() => ({
    reverse: null,
  }));
  if (!reverse) return [];
  return [`${reverse}.sol`];
}
