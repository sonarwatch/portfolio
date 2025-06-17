import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import escrowFetcher from './escrowFetcher';
import stakingFetcher from './stakingFetcher';
import { airdropFetcher } from './airdropFetcher';
import bidsFetcher from './bidsFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [escrowFetcher, stakingFetcher, bidsFetcher];
export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
