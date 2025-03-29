import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lockersFetcher from './lockersFetcher';
import stakingFetcher from './stakingFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [lockersFetcher, stakingFetcher];
