import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import marketsJob from './marketsJob';
import stakingFetcher from './stakingFetcher';
import positionsFetcher from './positionsFetcher';
import ordersFetcher from './ordersFetcher';

export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [
  stakingFetcher,
  positionsFetcher,
  ordersFetcher,
];
