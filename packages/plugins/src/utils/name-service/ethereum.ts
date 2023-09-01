import { NetworkId } from '@sonarwatch/portfolio-core';
import { getEvmClient } from '../clients';

export async function getNamesEthereum(address: string): Promise<string[]> {
  const client = getEvmClient(NetworkId.ethereum);
  const ensName = await client.getEnsName({
    address: address as `0x${string}`,
  });
  if (!ensName) return [];
  return [ensName.normalize()];
}
