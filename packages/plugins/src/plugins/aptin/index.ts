import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import depositsFetcher from './depositsFetcher';
import depositsJob from './depositsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [depositsJob];
export const fetchers: Fetcher[] = [depositsFetcher];
