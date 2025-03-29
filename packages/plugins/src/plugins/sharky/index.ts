import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import collectionsJob from './collectionsJob';
import loansFetcher from './loansFetcher';

export const jobs: Job[] = [collectionsJob];
export const fetchers: Fetcher[] = [loansFetcher];
