import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { instadappPlatform } from './constants';
import liteJob from './liteJob';

export const platforms: Platform[] = [instadappPlatform];
export const jobs: Job[] = [liteJob];
export const fetchers: Fetcher[] = [];
