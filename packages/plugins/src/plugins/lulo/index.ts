import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './depositsFetcher';
import poolsJob from './poolsJob';
import { platform } from './constants';
import rewardsFetcher from './rewardsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [depositsFetcher, rewardsFetcher];
