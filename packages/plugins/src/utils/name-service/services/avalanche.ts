import {
  NetworkId,
  formatEvmAddress,
  avalancheNameChecker,
} from '@sonarwatch/portfolio-core';
import { getEvmClient } from '../../clients';
import { NameService } from '../types';

const resolutionUtilsV2Address = '0x1ea4e7A798557001b99D88D6b4ba7F7fc79406A9';
const abi = [
  {
    inputs: [{ internalType: 'address', name: 'addy', type: 'address' }],
    name: 'reverseResolveEVMToName',
    outputs: [{ internalType: 'string', name: 'preimage', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'uint256', name: 'key', type: 'uint256' },
    ],
    name: 'resolveStandard',
    outputs: [{ internalType: 'string', name: 'value', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

async function getOwner(name: string): Promise<string | null> {
  const client = getEvmClient(NetworkId.avalanche);
  const owner = await client.readContract({
    abi,
    address: resolutionUtilsV2Address,
    functionName: 'resolveStandard',
    args: [name, BigInt(3)],
  });
  if (owner === '') return null;
  return formatEvmAddress(owner);
}

async function getNames(address: string): Promise<string[]> {
  const client = getEvmClient(NetworkId.avalanche);
  const result = await client.readContract({
    abi,
    address: resolutionUtilsV2Address,
    functionName: 'reverseResolveEVMToName',
    args: [address as `0x${string}`],
  });
  if (result === '') return [];
  return [result.normalize()];
}

export const nameService: NameService = {
  id: 'avalanche',
  checker: avalancheNameChecker,
  getNames,
  getOwner,
};
