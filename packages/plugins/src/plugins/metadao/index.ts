import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import vaultsJob from './vaultsJob';
import poolsJob from './poolsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [vaultsJob, poolsJob];
export const fetchers: Fetcher[] = [];
