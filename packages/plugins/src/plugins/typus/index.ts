import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import vaultsFetcher from './vaultsFetcher';
import safuVaultsJob from './safuVaultsJob';
import safuFetcher from './safuFetcher';

export const jobs: Job[] = [safuVaultsJob];
export const fetchers: Fetcher[] = [vaultsFetcher, safuFetcher];
