import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { genesysGoPlatform } from './constants';
import stakingFetcher from './stakingFetcher';

export const platforms: Platform[] = [genesysGoPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [stakingFetcher];
