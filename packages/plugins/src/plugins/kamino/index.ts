import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { kaminoPlatform } from './constants';
import poolsJob from './poolsJob';

export const platforms: Platform[] = [kaminoPlatform];
export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [];
