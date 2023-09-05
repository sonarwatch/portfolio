import { NetworkId, formatEvmAddress } from '@sonarwatch/portfolio-core';
import { getEvmClient, getEvmEthersClient } from '../clients';

export async function getOwnerEthereum(name: string): Promise<string | null> {
  const client = getEvmEthersClient(NetworkId.ethereum);
  const owner = await client.resolveName(name);
  if (!owner) return null;
  return formatEvmAddress(owner);
}

export async function getNamesEthereum(address: string): Promise<string[]> {
  const client = getEvmClient(NetworkId.ethereum);
  const ensName = await client.getEnsName({
    address: address as `0x${string}`,
  });
  if (!ensName) return [];
  return [ensName.normalize()];
}
