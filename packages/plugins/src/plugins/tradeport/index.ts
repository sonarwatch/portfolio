import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import positionsFetcher from './positionsFetcher';
import locksJob from './locksJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [locksJob];
export const fetchers: Fetcher[] = [positionsFetcher];
