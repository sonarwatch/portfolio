import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import stakingFetcher from './stakingFetcher';
import marketsJob from './marketsJob';
import loansFetcher from './loansFetcher';
import offersFetcher from './offersFetcher';
import vaultsJob from './vaultsJob';
import vaultsFetcher from './vaultsFetcher';

export const jobs: Job[] = [marketsJob, vaultsJob];
export const fetchers: Fetcher[] = [
  stakingFetcher,
  loansFetcher,
  offersFetcher,
  vaultsFetcher,
];
