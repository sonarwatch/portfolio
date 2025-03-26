import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import stakingFetcher from './stakingFetcher';
import { s1AirdropFetcher, s1Fetcher } from './airdropFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [stakingFetcher, s1Fetcher];

export const airdropFetchers: AirdropFetcher[] = [s1AirdropFetcher];
