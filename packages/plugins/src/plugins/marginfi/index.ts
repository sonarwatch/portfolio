import { Platform } from '@sonarwatch/portfolio-core';
import banksJob from './banksJob';
import depositsFetcher from './depositsFetcher';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import { platform } from './constants';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [banksJob];
export const fetchers: Fetcher[] = [depositsFetcher];
