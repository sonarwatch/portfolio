import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { atrixPlatform } from './constants';
import poolsV1Job from './poolsV1Job';

export const platforms: Platform[] = [atrixPlatform];
export const jobs: Job[] = [poolsV1Job];
export const fetchers: Fetcher[] = [];
