import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import vaultFetcher from './vaultsFetcher';
import vaultJob from './vaultsJob';
import poolsJob from './farmsJob';
import farmsFetcher from './farmsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [vaultJob, poolsJob];
export const fetchers: Fetcher[] = [vaultFetcher, farmsFetcher];
