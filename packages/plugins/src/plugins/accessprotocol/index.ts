import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { accessPlatform } from './constants';
import positionFetcher from './positionFetcher';

export const platforms: Platform[] = [accessPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [positionFetcher];
