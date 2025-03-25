import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import lendVaultsFetcher from './lendVaultsFetcher';
import vaultsJob from './vaultsJob';
import lendFetcher from './lendFetcher';
import loansFetcher from './loansFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [vaultsJob];
export const fetchers: Fetcher[] = [
  lendVaultsFetcher,
  lendFetcher,
  loansFetcher,
];
