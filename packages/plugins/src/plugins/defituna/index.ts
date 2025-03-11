import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import lendingFetcher from './lendingFetcher';
import lendingPoolsJob from './lendingPoolsJob';
import positionsFetcher from './positionsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lendingPoolsJob];
export const fetchers: Fetcher[] = [lendingFetcher, positionsFetcher];
