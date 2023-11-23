import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import poolsV1Job from './poolsV1Job';
import farmsV1Fetcher from './farmsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolsV1Job];
export const fetchers: Fetcher[] = [farmsV1Fetcher];
