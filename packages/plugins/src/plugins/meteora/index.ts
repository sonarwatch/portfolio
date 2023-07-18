import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import vaultsJob from './vaultsJob';
import poolsJob from './poolsJob';

export const jobs: Job[] = [vaultsJob, poolsJob];
export const fetchers: Fetcher[] = [];
