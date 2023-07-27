import { EvmNetworkIdType, NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../../../Fetcher';
import { walletTokensPlatform } from '../../../../platforms';
import getEvmFetcherExecutor from './evmExecutorGenerator';

const evmNetworksIds: EvmNetworkIdType[] = [
  NetworkId.ethereum,
  NetworkId.avalanche,
];

export const fetchers: Fetcher[] = [
  ...evmNetworksIds
    .map((networkId) => [
      {
        id: `${walletTokensPlatform.id}-${networkId}`,
        networkId,
        executor: getEvmFetcherExecutor(networkId, false),
      },
      // {
      //   id: `${walletTokensPlatform.id}-${networkId}`,
      //   networkId,
      //   executor: getEvmFetcherNativeExecutor(networkId, false),
      // },
    ])
    .flat(),
];
