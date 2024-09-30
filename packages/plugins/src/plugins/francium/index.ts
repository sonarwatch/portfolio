import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import lendingPoolJob from './lendingPoolJob';
import lendingFetcher from './lendingFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lendingPoolJob];
export const fetchers: Fetcher[] = [lendingFetcher];
