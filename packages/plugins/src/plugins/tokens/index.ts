import {
  NetworkId,
  Platform,
  networksAsArray,
} from '@sonarwatch/portfolio-core';
import jobGenerator from './jobGenerator';
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
  jobGenerator(NetworkId.bitcoin),
  jobGenerator(NetworkId.aptos),
  jobGenerator(NetworkId.solana),
  jobGenerator(NetworkId.ethereum),
  jobGenerator(NetworkId.avalanche),
  jobGenerator(NetworkId.polygon),
  jobGenerator(NetworkId.sui),
  jobGenerator(NetworkId.sei),
  jobGenerator(NetworkId.bnb),
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
