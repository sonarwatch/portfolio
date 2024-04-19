import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { phoenixPlatform } from './constants';
import positionsFetcher from './positionsFetcher';

export const platforms: Platform[] = [phoenixPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [positionsFetcher];
