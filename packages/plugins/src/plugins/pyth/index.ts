import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { pythPlatform } from './constants';
import stakingFetcher from './stakingFetcher';

export const platforms: Platform[] = [pythPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [stakingFetcher];
