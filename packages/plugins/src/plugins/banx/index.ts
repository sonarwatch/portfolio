import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { banxPlatform } from './constants';
import stakingFetcher from './stakingFetcher';

export const platforms: Platform[] = [banxPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [stakingFetcher];
