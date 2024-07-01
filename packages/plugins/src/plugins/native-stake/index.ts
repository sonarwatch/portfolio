import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import suiFetcher from './suiFetcher';
import aptosFetcher from './aptosFetcher';
import solanaFetcher from './solana/solanaFetcher';
import seiFetcher from './seiFetcher';
import activeValidatorsAptosJob from './activeValidatorsAptosJob';
import { nativeStakePlatform } from './constants';
import solanaEpochJob from './solana/solanaEpochJob';
import solanaValidatorsJob from './solana/solanaValidatorsJob';

export const platforms: Platform[] = [nativeStakePlatform];
export const jobs: Job[] = [
  activeValidatorsAptosJob,
  solanaEpochJob,
  solanaValidatorsJob,
];
export const fetchers: Fetcher[] = [
  suiFetcher,
  aptosFetcher,
  solanaFetcher,
  seiFetcher,
];
