import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import poolsJob from './poolsJob';
import delegateJob from './delegateJob';
import proofsFetcher from './proofsFetcher';
import { airdropFetcher, fetcher } from './airdropFetcher';
import poolsYieldJob from './poolsYieldJob';

export const jobs: Job[] = [poolsJob, delegateJob, poolsYieldJob];
export const fetchers: Fetcher[] = [proofsFetcher, fetcher];

export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
