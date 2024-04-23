import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import sdaiJob from './sdaiJob';
import { platform } from './constants';
import vaultsFetcher from './vaultsFetcher';
import vaultsJob from './vaultsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [sdaiJob, vaultsJob];
export const fetchers: Fetcher[] = [vaultsFetcher];
