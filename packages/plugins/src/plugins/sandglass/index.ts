import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositFetcher from './depositFetcher';
import marketJob from './marketsJob';

export const jobs: Job[] = [marketJob];
export const fetchers: Fetcher[] = [depositFetcher];
