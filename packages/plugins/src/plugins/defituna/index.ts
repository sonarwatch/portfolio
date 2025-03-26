import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lendingFetcher from './lendingFetcher';
import lendingPoolsJob from './lendingPoolsJob';
import positionsFetcher from './positionsFetcher';

export const jobs: Job[] = [lendingPoolsJob];
export const fetchers: Fetcher[] = [lendingFetcher, positionsFetcher];
