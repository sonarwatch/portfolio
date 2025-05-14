import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import banksJob from './banksJob';
import depositsFetcher from './depositsFetcher';

export const jobs: Job[] = [banksJob];
export const fetchers: Fetcher[] = [depositsFetcher];
