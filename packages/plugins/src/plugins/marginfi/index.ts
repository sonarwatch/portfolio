import banksJob from './banksJob';
import depositsFetcher from './depositsFetcher';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';

export const jobs: Job[] = [banksJob];
export const fetchers: Fetcher[] = [depositsFetcher];
