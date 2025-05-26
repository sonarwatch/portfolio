import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import mpstPricingJob from './mpstPricingJob';
import { airdropFetcher, fetcher } from './airdropFetcher';
import { AirdropFetcher } from '../../AirdropFetcher';

export const jobs: Job[] = [mpstPricingJob];
export const fetchers: Fetcher[] = [fetcher];
export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
