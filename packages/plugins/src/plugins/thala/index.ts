import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import vaultRateJob from './vaultsRatesJob';
import lpTokenJob from './lpTokensJob';
import stakingAprJob from './stakingAprJob';
import fetcherVaults from './vaultsFetcher';
import fetcherStab from './stabilityPoolFetcher';
import { platform } from './constants';
import farmingPoolsJob from './farmingPoolsJob';
import vethlFetcher from './vethlFetcher';
import farmingPoolsFetcher from './farmingPoolsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [
  vaultRateJob,
  lpTokenJob,
  stakingAprJob,
  farmingPoolsJob,
];
export const fetchers: Fetcher[] = [
  fetcherVaults,
  fetcherStab,
  vethlFetcher,
  farmingPoolsFetcher,
];
