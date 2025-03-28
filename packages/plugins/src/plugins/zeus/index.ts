import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import delegationsFetcher from './delegationsFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [delegationsFetcher];
export const platforms: Platform[] = [platform];
