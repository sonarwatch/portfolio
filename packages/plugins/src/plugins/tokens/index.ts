import {
  NetworkId,
  Platform,
  networksAsArray,
} from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import {} from 'graphql';

import { walletNftsPlatform, walletTokensPlatform } from './constants';
import jobGenerator from './jobGenerator';
import aptosFetcher from './fetchers/aptos';
import suiFetcher from './fetchers/sui';
import suiNftsFetcher from './fetchers/sui-nfts';
import seiFetcher from './fetchers/sei';
import bitcoinFetcher from './fetchers/bitcoin';
import solanaFetcher from './fetchers/solana';
import solanaNativeFetcher from './fetchers/solana-native';
import solanaNftsUnderlyingsFetcher from './fetchers/solana-nfts-underlyings';
import { fetchers as evmFetchers } from './fetchers/evms';
import getTokenListsJob from './getTokenListsJob';

import solanaSimpleFetcher from './fetchers/solana-simple';

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
  solanaNftsUnderlyingsFetcher,
  suiFetcher,
  suiNftsFetcher,
  seiFetcher,
  bitcoinFetcher,
  ...evmFetchers,
];

export { solanaSimpleFetcher };
