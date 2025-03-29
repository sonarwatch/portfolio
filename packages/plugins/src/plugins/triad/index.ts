import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import stakingFetcher from './stakingFetcher';
import marketsFetcher from './marketsFetcher';
import marketsJob from './marketsJob';

export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [stakingFetcher, marketsFetcher];
