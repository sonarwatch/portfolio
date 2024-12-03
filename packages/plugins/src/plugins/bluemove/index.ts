import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import poolsJob from './poolsJob';
import lockLpJob from './lockLpJob';
import lockLpFetcher from './lockLpFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolsJob, lockLpJob];
export const fetchers: Fetcher[] = [lockLpFetcher];
