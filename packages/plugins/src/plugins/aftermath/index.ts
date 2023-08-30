import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import poolsJob from './poolsJob';
import { aftermathPlatform } from './constants';

export const platforms: Platform[] = [aftermathPlatform];
export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [];
