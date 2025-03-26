import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import marketsJob from './marketsJob';
import depositsFetcher from './depositsFetcher';

export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [depositsFetcher];
