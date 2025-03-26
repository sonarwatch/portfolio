import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import delegationsFetcher from './delegationsFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [delegationsFetcher];
