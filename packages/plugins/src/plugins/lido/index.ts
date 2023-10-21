import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { fooPlatform } from './constants';
import withdrawlFetcher from './withdrawlFetcher';

export const platforms: Platform[] = [fooPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [withdrawlFetcher];
