import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import positionsFetcher from './positionsFetcher';
import locksJob from './locksJob';
import bidsJob from './bidsJob';
import bidsFetcher from './bidsFetcher';
import kioskProfitsFetcher from './kioskProfitsFetcher';

export const jobs: Job[] = [locksJob, bidsJob];
export const fetchers: Fetcher[] = [
  positionsFetcher,
  bidsFetcher,
  kioskProfitsFetcher,
];
