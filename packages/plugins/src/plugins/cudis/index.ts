import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { airdropFetcher, fetcher } from './airdropFetcher';
import stakingFetcher from './stakingFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [stakingFetcher, fetcher];
export const airdropFetchers = [airdropFetcher];
