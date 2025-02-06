import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import positionsFetcher from './positionsFetcher';
import lendingPoolsJob from './lendingPoolsJob';
import stakingFetcher from './stakingFetcher';
import stakingPoolJob from './stakingPoolJob';
import solayerPoolsJob from './solayerPoolsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lendingPoolsJob, stakingPoolJob, solayerPoolsJob];
export const fetchers: Fetcher[] = [positionsFetcher, stakingFetcher];
