import { NetworkId } from '@sonarwatch/portfolio-core';
import { walletTokensPlatform } from '../../platforms';
import jobExecutorGenerator from './jobExecutorGenerator';
import aptosFetcher from './fetchers/aptos';
import solanaFetcher from './fetchers/solana';
import solanaNativeFetcher from './fetchers/solana-native';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';

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
    id: `${walletTokensPlatform.id}-${NetworkId.sui}`,
    executor: jobExecutorGenerator(NetworkId.sui),
  },
];

export const fetchers: Fetcher[] = [
  aptosFetcher,
  solanaFetcher,
  solanaNativeFetcher,
];
