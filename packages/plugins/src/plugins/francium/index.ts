import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lendingPoolJob from './lendingPoolJob';
import lendingFetcher from './lendingFetcher';

export const jobs: Job[] = [lendingPoolJob];
export const fetchers: Fetcher[] = [lendingFetcher];
