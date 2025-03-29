import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import offersFetcher from './offersFetcher';
import airdropFetcher from './airdropFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [offersFetcher, airdropFetcher];
