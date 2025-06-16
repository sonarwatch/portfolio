import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import suiFetcher from './suiFetcher';
import aptosFetcher from './aptosFetcher';
import solanaFetcher from './solana/solanaFetcher';
import seiFetcher from './seiFetcher';
import activeValidatorsAptosJob from './activeValidatorsAptosJob';
import solanaEpochJob from './solana/solanaEpochJob';
import solanaValidatorsJob from './solana/solanaValidatorsJob';
// import suiValidatorsJob from './activeValidatorsSuiJob';

export const jobs: Job[] = [
  activeValidatorsAptosJob,
  solanaEpochJob,
  solanaValidatorsJob,
  // suiValidatorsJob,
];
export const fetchers: Fetcher[] = [
  suiFetcher,
  aptosFetcher,
  solanaFetcher,
  seiFetcher,
];
