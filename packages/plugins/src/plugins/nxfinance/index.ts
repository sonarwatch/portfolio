import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import positionsFetcher from './positionsFetcher';
import lendPositionsFetcher from './lendPositionsFetcher';
import lendingPoolsJob from './lendingPoolsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lendingPoolsJob];
export const fetchers: Fetcher[] = [positionsFetcher, lendPositionsFetcher];
