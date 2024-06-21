import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './depositsFetcher';
import airdropFetcher from './airdropFetcher';
import { platform } from './constants';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [depositsFetcher, airdropFetcher];
export const platforms: Platform[] = [platform];
