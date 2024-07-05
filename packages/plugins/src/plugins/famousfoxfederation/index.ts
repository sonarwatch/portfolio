import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import tokenMarketFetcher from './tokenMarketFetcher';
import stakingFetcher from './stakingFetcher';
import stakingJob from './stakingJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [stakingJob];
export const fetchers: Fetcher[] = [tokenMarketFetcher, stakingFetcher];
