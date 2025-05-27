import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositFetcher from './stakingFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [depositFetcher];
