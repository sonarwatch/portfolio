import {
  EvmNetworkIdType,
  NetworkIdType,
  networks,
} from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../../Fetcher';
import { walletTokensPlatform } from '../../../platforms';
import getEvmExecutor from './evmExecutorGenerator';

export function evmFetchers(): Fetcher[] {
  const evmNetworksIds: EvmNetworkIdType[] = [];

  const networksIds = Object.keys(networks);
  for (let i = 0; i < networksIds.length; i += 1) {
    const networkId = networksIds[i] as NetworkIdType;
    const network = networks[networkId];
    if (network.addressSystem === 'evm')
      evmNetworksIds.push(networkId as EvmNetworkIdType);
  }

  return evmNetworksIds.map((networkId) => ({
    id: `${walletTokensPlatform.id}-${networkId}`,
    networkId,
    executor: getEvmExecutor(networkId, false),
  }));
}
