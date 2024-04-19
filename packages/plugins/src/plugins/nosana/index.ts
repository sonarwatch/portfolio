import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { nosanaPlatform } from './constants';
import stakingFetcher from './stakingFetcher';

export const platforms: Platform[] = [nosanaPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [stakingFetcher];
