import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import liquidityFetcher from './poolsFetcher';
import stakingFetcher from './stakingFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [liquidityFetcher, stakingFetcher];
