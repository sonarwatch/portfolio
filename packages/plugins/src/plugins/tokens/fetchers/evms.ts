import { EvmNetworkIdType, NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../../Fetcher';
import { walletTokensPlatform } from '../../../platforms';
import getEvmFetcherExecutor from './evmExecutorGenerator';

export function evmFetchers(): Fetcher[] {
  const evmNetworksIds: EvmNetworkIdType[] = [
    NetworkId.ethereum,
    NetworkId.avalanche,
  ];

  return evmNetworksIds.map((networkId) => ({
    id: `${walletTokensPlatform.id}-${networkId}`,
    networkId,
    executor: getEvmFetcherExecutor(networkId, false),
  }));
}
