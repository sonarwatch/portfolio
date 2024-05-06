import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import depositFetcher from './depositFetcher';
import marketJob from './marketsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [marketJob];
export const fetchers: Fetcher[] = [depositFetcher];
