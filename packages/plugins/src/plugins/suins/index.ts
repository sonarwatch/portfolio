import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { airdropFetcher, fetcher as s1Fetcher } from './airdropFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [s1Fetcher];

export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
