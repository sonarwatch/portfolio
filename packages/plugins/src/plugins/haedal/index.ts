import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import vaultFetcher from './vaultFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [vaultFetcher];
