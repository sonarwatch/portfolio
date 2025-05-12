import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import offersFetcher from './offersFetcher';
import airdropFetcher from './airdropFetcher';
import {
  airdropFetcher as snsAirdropFetcher,
  fetcher,
} from './snsAirdropFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [offersFetcher, airdropFetcher, fetcher];

export const airdropFetchers = [snsAirdropFetcher];
