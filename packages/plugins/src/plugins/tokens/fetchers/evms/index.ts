import { EvmNetworkIdType, NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../../../Fetcher';
import { walletTokensPlatform } from '../../../../platforms';
import getEvmFetcherExecutor from './evmExecutorGenerator';
import getEvmFetcherNativeExecutor from './evmNativeExecutorGenerator';

const evmNetworksIds: EvmNetworkIdType[] = [
  NetworkId.ethereum,
  NetworkId.avalanche,
  NetworkId.polygon,
];

export const fetchers: Fetcher[] = [
  ...evmNetworksIds
    .map((networkId) => [
      {
        id: `${walletTokensPlatform.id}-${networkId}-native`,
        networkId,
        executor: getEvmFetcherNativeExecutor(networkId),
      },
      {
        id: `${walletTokensPlatform.id}-${networkId}`,
        networkId,
        executor: getEvmFetcherExecutor(networkId, false),
      },
    ])
    .flat(),
];
