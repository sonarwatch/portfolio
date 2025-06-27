import { NetworkId, networksAsArray } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';

import jobGenerator from './jobGenerator';
import aptosFetcher from './fetchers/aptos';
import suiFetcher from './fetchers/sui';
import suiNftsFetcher from './fetchers/sui-nfts';
import seiFetcher from './fetchers/sei';
import bitcoinFetcher from './fetchers/bitcoin';
import solanaNativeFetcher from './fetchers/solana-native';
import solanaNftFetcher from './fetchers/solana-nft';
import solanaTokens from './fetchers/solana';
import { fetchers as evmFetchers } from './fetchers/evms';
import getTokenListsJob from './getTokenListsJob';

import solanaSimpleFetcher from './fetchers/solana-simple';

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
  solanaNativeFetcher,
  solanaTokens,
  suiFetcher,
  suiNftsFetcher,
  seiFetcher,
  bitcoinFetcher,
  ...evmFetchers,
];

export { solanaSimpleFetcher };
export { solanaNftFetcher }
