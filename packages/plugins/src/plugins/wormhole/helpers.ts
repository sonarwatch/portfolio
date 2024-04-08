import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { PublicKey } from '@solana/web3.js';
import { apiUrl } from './constants';
import { AllocationResponse } from './types';

const extensionByAddressSystem: Map<NetworkIdType, string> = new Map([
  [NetworkId.solana, '_1'],
  [NetworkId.ethereum, '_2'],
  [NetworkId.polygon, '_2'],
  [NetworkId.avalanche, '_2'],
  [NetworkId.bnb, '_2'],
  [NetworkId.sui, '_21'],
  [NetworkId.aptos, '_22'],
]);

export async function getAllocation(
  owner: string,
  network: NetworkIdType
): Promise<number> {
  const extension = extensionByAddressSystem.get(network);
  if (!extension) return 0;

  const allocationsRes: AxiosResponse<AllocationResponse> | null = await axios
    .get(`${apiUrl}${owner}${extension}.json`, { timeout: 1000 })
    .catch(() => null);

  return allocationsRes ? allocationsRes.data.amount : 0;
}

export function getAccountPubkey(owner: string) {
  return new PublicKey('GyxMPFeekoY6t5WwgbXFn9vqG3uEAqJp2mDkia6Ws9z7');
}
