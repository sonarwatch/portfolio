import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import lockersFetcher from './lockersFetcher';
import stakingFetcher from './stakingFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [lockersFetcher, stakingFetcher];
