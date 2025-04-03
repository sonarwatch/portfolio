import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import delegationsFetcher from './delegationsFetcher';
import delegationsSKitFetcher from './delegationsSKitFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [delegationsFetcher, delegationsSKitFetcher];
