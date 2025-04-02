import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import stakingFetcher from './stakingFetcher';
import pricingJob from './pricingJob';

export const jobs: Job[] = [pricingJob];
export const fetchers: Fetcher[] = [stakingFetcher];
