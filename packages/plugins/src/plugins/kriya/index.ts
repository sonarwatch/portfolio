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

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [vaultsJob, leverageVaultsJob, farmsJob];
export const fetchers: Fetcher[] = [
  vaultsFetcher,
  leverageVaultsFetcher,
  farmsFetcher,
];
