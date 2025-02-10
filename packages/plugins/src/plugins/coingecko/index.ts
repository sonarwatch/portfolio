import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import fiatJob from './fiatJob';

export * from './constants';

export const platforms: Platform[] = [];
export const jobs: Job[] = [fiatJob];
export const fetchers: Fetcher[] = [];
