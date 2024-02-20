import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import depositsFetcher from './depositsFetcher';
import marginFetcher from './marginFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [depositsFetcher, marginFetcher];
