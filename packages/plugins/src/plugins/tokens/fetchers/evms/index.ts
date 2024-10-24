import { EvmNetworkIdType, NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../../../Fetcher';
import getEvmFetcherExecutor from './evmExecutorGenerator';
import getEvmFetcherNativeExecutor from './evmNativeExecutorGenerator';
import { walletTokensPlatform } from '../../constants';

const evmNativeNetworksIds: EvmNetworkIdType[] = [
  NetworkId.ethereum,
  NetworkId.avalanche,
];
const evmNetworksIds: EvmNetworkIdType[] = [
  NetworkId.ethereum,
  NetworkId.bnb,
  NetworkId.avalanche,
  NetworkId.polygon,
];

export const fetchers: Fetcher[] = [
  ...evmNativeNetworksIds
    .map((networkId) => [
      {
        id: `${walletTokensPlatform.id}-${networkId}-native`,
        networkId,
        executor: getEvmFetcherNativeExecutor(networkId),
      },
    ])
    .flat(),
  ...evmNetworksIds
    .map((networkId) => [
      {
        id: `${walletTokensPlatform.id}-${networkId}-top`,
        networkId,
        executor: getEvmFetcherExecutor(networkId, true),
      },
      {
        id: `${walletTokensPlatform.id}-${networkId}-bottom`,
        networkId,
        executor: getEvmFetcherExecutor(networkId, false),
      },
    ])
    .flat(),
];
