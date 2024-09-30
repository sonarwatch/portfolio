import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import positionsJob from './positionsJob';
import positionsFetcher from './positionsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [positionsJob];
export const fetchers: Fetcher[] = [positionsFetcher];
