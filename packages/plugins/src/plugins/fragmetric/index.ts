import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import pricingJob from './pricingJob';
import { airdropFetcher } from './airdropFetcher';

export const jobs: Job[] = [pricingJob];
export const fetchers: Fetcher[] = [];
export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
