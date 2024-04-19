import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { wormholePlatform } from './constants';

export const platforms: Platform[] = [wormholePlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [];
