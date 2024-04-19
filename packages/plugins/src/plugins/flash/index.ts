import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { flashPlatform } from './constants';
import perpetualFetcher from './perpetualFetcher';
import custodiesJob from './custodiesJob';
import poolsJob from './poolJob';
import stakeFetcher from './stakeFetcher';

export const platforms: Platform[] = [flashPlatform];
export const jobs: Job[] = [custodiesJob, poolsJob];
export const fetchers: Fetcher[] = [perpetualFetcher, stakeFetcher];
