import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import sdaiJob from './sdaiJob';
import { makerPlatform } from './constants';
import vaultsFetcher from './vaultsFetcher';
import vaultsJob from './vaultsJob';

export const platforms: Platform[] = [makerPlatform];
export const jobs: Job[] = [sdaiJob, vaultsJob];
export const fetchers: Fetcher[] = [vaultsFetcher];
