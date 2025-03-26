import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import marketsJob from './marketsJob';
import lendingFetcher from './lendingFetcher';

export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [lendingFetcher];
