import {
  EvmNetworkIdType,
  NetworkId,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../../../Fetcher';
import getEvmFetcherExecutor from './evmExecutorGenerator';
import getEvmFetcherNativeExecutor from './evmNativeExecutorGenerator';

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
        id: `${walletTokensPlatformId}-${networkId}-native`,
        networkId,
        executor: getEvmFetcherNativeExecutor(networkId),
      },
    ])
    .flat(),
  ...evmNetworksIds
    .map((networkId) => [
      {
        id: `${walletTokensPlatformId}-${networkId}-top`,
        networkId,
        executor: getEvmFetcherExecutor(networkId, true),
      },
      {
        id: `${walletTokensPlatformId}-${networkId}-bottom`,
        networkId,
        executor: getEvmFetcherExecutor(networkId, false),
      },
    ])
    .flat(),
];
