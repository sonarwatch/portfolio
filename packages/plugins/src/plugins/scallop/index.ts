import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import addressJob from './addressJob';
import marketJob from './marketJob';
import lendingFetcher from './lendingsFetcher';
import obligationsFetcher from './obligationsFetcher';

export const jobs: Job[] = [
    addressJob,
    marketJob
];
export const fetchers: Fetcher[] = [
    lendingFetcher,
    obligationsFetcher
];
