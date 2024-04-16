import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './depositsFetcher';
import liftFetcher from './liftFetcher';
import { flexlendPlatform } from './constants';

export const platforms: Platform[] = [flexlendPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [depositsFetcher, liftFetcher];
