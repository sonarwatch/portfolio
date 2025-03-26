import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import stakingFetcher from './stakingFetcher';
import { airdropFetcher, fetcher } from './airdropFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [stakingFetcher, fetcher];

export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
