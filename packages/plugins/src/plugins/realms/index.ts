import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './depositsFetcher';
import { realmsPlatform } from './constants';
import programsJob from './programsJob';

export const jobs: Job[] = [programsJob];
export const fetchers: Fetcher[] = [depositsFetcher];
export const platforms: Platform[] = [realmsPlatform];
