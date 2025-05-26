import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import mpstPricingJob from './mpstPricingJob';
import { airdropFetcher, fetcher } from './airdropFetcher';
import { AirdropFetcher } from '../../AirdropFetcher';
import stakingFetcher from './stakingFetcher';

export const jobs: Job[] = [mpstPricingJob];
export const fetchers: Fetcher[] = [fetcher, stakingFetcher];
export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
