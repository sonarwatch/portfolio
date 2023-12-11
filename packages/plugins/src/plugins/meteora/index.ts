import { Platform } from '@sonarwatch/portfolio-core';
import vaultsJob from './vaultsJob';
import poolsJob from './poolsJob';
import farmsJob from './farmsJob';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import { meteoraPlatform } from './constants';
import farmsFetcher from './farmsFetcher';

export const platforms: Platform[] = [meteoraPlatform];
export const jobs: Job[] = [vaultsJob, poolsJob, farmsJob];
export const fetchers: Fetcher[] = [farmsFetcher];
