import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './depositsFetcher';
import vaultsJob from './vaultsJob';

export const jobs: Job[] = [vaultsJob];
export const fetchers: Fetcher[] = [depositsFetcher];
