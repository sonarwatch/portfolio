import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import jupiterFetcher from './jupiter/limitFetcher';
import serumOpenOrderFetcher from './serum/openOrdersFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [jupiterFetcher, serumOpenOrderFetcher];
