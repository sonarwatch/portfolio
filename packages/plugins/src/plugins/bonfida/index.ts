import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import offersFetcher from './offersFetcher';
import { airdropFetcher as fidaAirdropFetcher } from './airdropFetcher';
import {
  airdropFetcher as snsAirdropFetcher,
  fetcher as snsFetcher,
} from './snsAirdropFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [offersFetcher, snsFetcher];

export const airdropFetchers = [snsAirdropFetcher, fidaAirdropFetcher];
