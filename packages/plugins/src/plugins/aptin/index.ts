import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './depositsFetcher';
import depositsJob from './depositsJob';

export const jobs: Job[] = [depositsJob];
export const fetchers: Fetcher[] = [depositsFetcher];
