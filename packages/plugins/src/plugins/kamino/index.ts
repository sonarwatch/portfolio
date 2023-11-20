import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { kaminoPlatform } from './constants';
import poolsJob from './poolsJob';
import marketsJob from './marketsJob';
import reservesJob from './reservesJob';
import depositsFetcher from './depositsFetcher';

export const platforms: Platform[] = [kaminoPlatform];
export const jobs: Job[] = [poolsJob, marketsJob, reservesJob];
export const fetchers: Fetcher[] = [depositsFetcher];
