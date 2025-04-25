import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import collectionsJob from './collectionsJob';
import loansFetcher from './loansFetcher';
import tokensFetcher from './tokensFetcher';
import tokensOrderbookJob from './tokensOrderbookJob';

export const jobs: Job[] = [collectionsJob, tokensOrderbookJob];
export const fetchers: Fetcher[] = [loansFetcher, tokensFetcher];
