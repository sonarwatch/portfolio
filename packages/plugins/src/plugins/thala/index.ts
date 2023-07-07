import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import vaultRateJob from './vaultsRatesJob';
import lpTokenJob from './lpTokensJob';
import stakingAprJob from './stakingAprJob';
import fetcherVaults from './vaultsFetcher';
import fetcherStab from './stabilityPoolFetcher';

export const jobs: Job[] = [vaultRateJob, lpTokenJob, stakingAprJob];
export const fetchers: Fetcher[] = [fetcherVaults, fetcherStab];
