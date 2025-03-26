import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import marketsJob from './marketsJob';
import depositFetcher from './depositFetcher';

export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [depositFetcher];
