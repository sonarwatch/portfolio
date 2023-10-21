import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { lidoPlatform } from './constants';
import withdrawlFetcher from './withdrawlFetcher';

export const platforms: Platform[] = [lidoPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [withdrawlFetcher];
