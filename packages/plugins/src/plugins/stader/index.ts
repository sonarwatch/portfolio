import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { staderPlatform } from './constants';

export const platforms: Platform[] = [staderPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [];
