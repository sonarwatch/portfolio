import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './depositsFetcher';
import { airdropFetcher, fetcher } from './airdropFetcher';
import stakingFetcher from './stakingFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [depositsFetcher, fetcher, stakingFetcher];
export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
