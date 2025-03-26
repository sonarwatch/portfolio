import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import tokenMarketFetcher from './tokenMarketFetcher';
import stakingFetcher from './stakingFetcher';
import stakingJob from './stakingJob';

export const jobs: Job[] = [stakingJob];
export const fetchers: Fetcher[] = [tokenMarketFetcher, stakingFetcher];
