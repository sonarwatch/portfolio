import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lendVaultsFetcher from './lendVaultsFetcher';
import vaultsJob from './vaultsJob';
import lendFetcher from './lendFetcher';
import loansFetcher from './loansFetcher';

export const jobs: Job[] = [vaultsJob];
export const fetchers: Fetcher[] = [
  lendVaultsFetcher,
  lendFetcher,
  loansFetcher,
];
