import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { ariesPlatform } from './constants';
import depositsFetcher from './depositsFetcher';
import reserveJob from './reservesJob';

export const platforms: Platform[] = [ariesPlatform];
export const jobs: Job[] = [reserveJob];
export const fetchers: Fetcher[] = [depositsFetcher];
