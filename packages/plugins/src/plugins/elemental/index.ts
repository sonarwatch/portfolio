import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import poolsJob from './poolsJob';
import depositFetcher from './depositFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [depositFetcher];
