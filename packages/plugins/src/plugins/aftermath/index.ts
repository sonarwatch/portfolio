import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import poolsJob from './poolsJob';
import { platform } from './constants';
import stakingFetcher from './stakingFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [stakingFetcher];
