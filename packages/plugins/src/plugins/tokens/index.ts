import { NetworkId } from '@sonarwatch/portfolio-core';
import { walletTokensPlatform } from '../../platforms';
import jobExecutorGenerator from './jobExecutorGenerator';
import aptosFetcher from './fetchers/aptos';
import aptosNftsFetcher from './fetchers/aptos-nfts';
import solanaFetcher from './fetchers/solana';
import suiFetcher from './fetchers/sui';
import suiNftsFetcher from './fetchers/sui-nfts';
import seiFetcher from './fetchers/sei';
import solanaNativeFetcher from './fetchers/solana-native';
import solanaNftsFetcher from './fetchers/solana-nfts';
import solanaNftsUnderlyingsFetcher from './fetchers/solana-nfts-underlyings';
import { Job } from '../../Job';
import tokenListsJob from './tokenListsJob';
import { Fetcher } from '../../Fetcher';
import { fetchers as evmFetchers } from './fetchers/evms';

export const jobs: Job[] = [
  {
    id: `${walletTokensPlatform.id}-${NetworkId.aptos}`,
    executor: jobExecutorGenerator(NetworkId.aptos),
  },
  {
    id: `${walletTokensPlatform.id}-${NetworkId.solana}`,
    executor: jobExecutorGenerator(NetworkId.solana),
  },
  {
    id: `${walletTokensPlatform.id}-${NetworkId.ethereum}`,
    executor: jobExecutorGenerator(NetworkId.ethereum),
  },
  {
    id: `${walletTokensPlatform.id}-${NetworkId.avalanche}`,
    executor: jobExecutorGenerator(NetworkId.avalanche),
  },
  {
    id: `${walletTokensPlatform.id}-${NetworkId.polygon}`,
    executor: jobExecutorGenerator(NetworkId.polygon),
  },
  {
    id: `${walletTokensPlatform.id}-${NetworkId.sui}`,
    executor: jobExecutorGenerator(NetworkId.sui),
  },
  {
    id: `${walletTokensPlatform.id}-${NetworkId.sei}`,
    executor: jobExecutorGenerator(NetworkId.sei),
  },
  tokenListsJob,
];

export const fetchers: Fetcher[] = [
  aptosFetcher,
  aptosNftsFetcher,
  solanaFetcher,
  solanaNativeFetcher,
  solanaNftsFetcher,
  solanaNftsUnderlyingsFetcher,
  suiFetcher,
  suiNftsFetcher,
  seiFetcher,
  ...evmFetchers,
];
