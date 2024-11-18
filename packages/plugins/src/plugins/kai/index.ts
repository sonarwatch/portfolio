import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import vaultsJob from './vaultsJob';
import lpVaultsFetcher from './lpVaultsFetcher';
import supplyPoolsJob from './supplyPoolsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [vaultsJob, supplyPoolsJob];
export const fetchers: Fetcher[] = [lpVaultsFetcher];
