import { PublicKey } from '@solana/web3.js';
import {
  NameRegistryState,
  getDomainKeySync,
  getFavoriteDomain,
} from '@bonfida/spl-name-service';
import { bonfidaNameChecker } from '@sonarwatch/portfolio-core';
import { getClientSolana } from '../../clients';
import { NameService } from '../types';

async function getOwner(name: string): Promise<string | null> {
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

async function getNames(address: string): Promise<string[]> {
  const client = getClientSolana();
  const owner = new PublicKey(address);

  const { reverse } = await getFavoriteDomain(client, owner).catch(() => ({
    reverse: null,
  }));
  if (!reverse) return [];
  return [`${reverse}.sol`];
}

export const nameService: NameService = {
  id: 'bonfida',
  checker: bonfidaNameChecker,
  getNames,
  getOwner,
};
