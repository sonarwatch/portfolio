import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './depositsFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [depositsFetcher];
