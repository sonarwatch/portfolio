import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { gooseFxPlatform } from './constants';
import liquidityFetcher from './poolsFetcher';
import stakingFetcher from './stakingFetcher';

export const platforms: Platform[] = [gooseFxPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [liquidityFetcher, stakingFetcher];
