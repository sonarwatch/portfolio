import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import mpstPricingJob from './mpstPricingJob';
import { airdropFetcher, fetcher } from './airdropFetcher';
import { AirdropFetcher } from '../../AirdropFetcher';
import stakingFetcher from './stakingFetcher';
import pstYieldJob from './pstYieldJob';

export const jobs: Job[] = [mpstPricingJob, pstYieldJob];
export const fetchers: Fetcher[] = [fetcher, stakingFetcher];
export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
