import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import loansFetcher from './loansFetcher';
import pairsJob from './pairsJob';

export const jobs: Job[] = [pairsJob];
export const fetchers: Fetcher[] = [loansFetcher];
