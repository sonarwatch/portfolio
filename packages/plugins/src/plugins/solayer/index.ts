import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import poolsJob from './poolsJob';
import delegateJob from './delegateJob';
import proofsFetcher from './proofsFetcher';
import { airdropFetcher, fetcher } from './airdropFetcher';

export const jobs: Job[] = [poolsJob, delegateJob];
export const fetchers: Fetcher[] = [proofsFetcher, fetcher];

export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
