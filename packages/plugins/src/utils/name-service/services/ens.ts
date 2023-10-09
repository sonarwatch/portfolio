import {
  NetworkId,
  formatEvmAddress,
  ensNameChecker,
} from '@sonarwatch/portfolio-core';
import { getEvmClient, getEvmEthersClient } from '../../clients';
import { NameService } from '../types';

async function getOwner(name: string): Promise<string | null> {
  const client = getEvmEthersClient(NetworkId.ethereum);
  const owner = await client.resolveName(name);
  if (!owner) return null;
  return formatEvmAddress(owner);
}

async function getNames(address: string): Promise<string[]> {
  const client = getEvmClient(NetworkId.ethereum);
  const ensName = await client.getEnsName({
    address: address as `0x${string}`,
  });
  if (!ensName) return [];
  return [ensName.normalize()];
}

export const nameService: NameService = {
  id: 'ens',
  checker: ensNameChecker,
  getNames,
  getOwner,
};
