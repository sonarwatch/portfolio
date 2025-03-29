import {
  EvmNetworkIdType,
  NetworkId,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../../../Fetcher';
import getEvmFetcherNativeExecutor from './evmNativeExecutorGenerator';
import getEvmFetcherExecutorOctav from './evmExecutorGeneratorOctav';

const evmNativeNetworksIds: EvmNetworkIdType[] = [
  NetworkId.ethereum,
  NetworkId.avalanche,
  NetworkId.fraxtal,
];
const evmNetworksIds: EvmNetworkIdType[] = [
  NetworkId.ethereum,
  NetworkId.bnb,
  NetworkId.avalanche,
  NetworkId.polygon,
  NetworkId.fraxtal,
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
        executor: getEvmFetcherExecutorOctav(networkId, true),
      },
      // These are not used
      // {
      //   id: `${walletTokensPlatform.id}-${networkId}-bottom`,
      //   networkId,
      //   executor: getEvmFetcherExecutor(networkId, false),
      // },
    ])
    .flat(),
];
