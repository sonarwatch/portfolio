import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import sdaiJob from './sdaiJob';
import vaultsFetcher from './vaultsFetcher';
import vaultsJob from './vaultsJob';

export const jobs: Job[] = [sdaiJob, vaultsJob];
export const fetchers: Fetcher[] = [vaultsFetcher];
