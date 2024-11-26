import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import vaultsFetcher from './vaultsFetcher';
import vaultsJob from './vaultsJob';
import farmsJob from './farmsJob';
import farmsFetcher from './farmsFetcher';
import leverageVaultsFetcher from './leverageVaultsFetcher';
import leverageVaultsJob from './leverageVaultsJob';
import clmmsFetcher from './clmmsFetcher';
import lpFetcher from './lpFetcher';
import poolsStatsJob from './poolsStatsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [
  vaultsJob,
  leverageVaultsJob,
  farmsJob,
  poolsStatsJob,
];
export const fetchers: Fetcher[] = [
  vaultsFetcher,
  leverageVaultsFetcher,
  farmsFetcher,
  clmmsFetcher,
  lpFetcher,
];
