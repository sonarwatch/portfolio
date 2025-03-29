import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import vaultsJob from './vaultsJob';
import lpVaultsFetcher from './lpVaultsFetcher';
import supplyPoolsJob from './supplyPoolsJob';

export const jobs: Job[] = [vaultsJob, supplyPoolsJob];
export const fetchers: Fetcher[] = [lpVaultsFetcher];
