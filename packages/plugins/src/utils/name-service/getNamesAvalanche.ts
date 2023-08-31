import { NetworkId } from '@sonarwatch/portfolio-core';
import { getEvmClient } from '../clients';

const resolutionUtilsV2Address = '0x1ea4e7A798557001b99D88D6b4ba7F7fc79406A9';
const abi = [
  {
    inputs: [{ internalType: 'address', name: 'addy', type: 'address' }],
    name: 'reverseResolveEVMToName',
    outputs: [{ internalType: 'string', name: 'preimage', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export async function getNamesAvalanche(address: string): Promise<string[]> {
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
