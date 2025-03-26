import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import stakingFetcher from './stakingFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [stakingFetcher];
