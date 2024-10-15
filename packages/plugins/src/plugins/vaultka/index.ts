import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import positionsFetcher from './positionsFetcher';
import lendingJob from './lendingJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lendingJob];
export const fetchers: Fetcher[] = [positionsFetcher];
