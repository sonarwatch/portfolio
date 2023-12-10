import {
  NetworkId,
  Platform,
  networksAsArray,
} from '@sonarwatch/portfolio-core';
import jobExecutorGenerator from './jobExecutorGenerator';
import aptosFetcher from './fetchers/aptos';
import solanaFetcher from './fetchers/solana';
import suiFetcher from './fetchers/sui';
import suiNftsFetcher from './fetchers/sui-nfts';
import seiFetcher from './fetchers/sei';
import bitcoinFetcher from './fetchers/bitcoin';
import solanaNativeFetcher from './fetchers/solana-native';
import solanaCNftsFetcher from './fetchers/solana-cnfts';
import solanaNftsFetcher from './fetchers/solana-nfts';
import solanaNftsUnderlyingsFetcher from './fetchers/solana-nfts-underlyings';
import { Job } from '../../Job';
import getTokenListsJob from './getTokenListsJob';
import { Fetcher } from '../../Fetcher';
import { fetchers as evmFetchers } from './fetchers/evms';
import { walletNftsPlatform, walletTokensPlatform } from './constants';
import {} from 'graphql';

export const platforms: Platform[] = [walletTokensPlatform, walletNftsPlatform];
export const jobs: Job[] = [
  {
    id: `${walletTokensPlatform.id}-${NetworkId.bitcoin}`,
    executor: jobExecutorGenerator(NetworkId.bitcoin),
  },
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
  {
    id: `${walletTokensPlatform.id}-${NetworkId.bnb}`,
    executor: jobExecutorGenerator(NetworkId.bnb),
  },
  ...networksAsArray.map((network) => getTokenListsJob(network.id)),
];

export const fetchers: Fetcher[] = [
  aptosFetcher,
  solanaFetcher,
  solanaNativeFetcher,
  solanaNftsFetcher,
  solanaCNftsFetcher,
  solanaNftsUnderlyingsFetcher,
  suiFetcher,
  suiNftsFetcher,
  seiFetcher,
  bitcoinFetcher,
  ...evmFetchers,
];
