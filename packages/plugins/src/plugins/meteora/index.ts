import { Platform } from '@sonarwatch/portfolio-core';
import vaultsJob from './vaultsJob';
import poolsJob from './poolsJob';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import { meteoraPlatform } from './constants';

export const platforms: Platform[] = [meteoraPlatform];
export const jobs: Job[] = [vaultsJob, poolsJob];
export const fetchers: Fetcher[] = [];
