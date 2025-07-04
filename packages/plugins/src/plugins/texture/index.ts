import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import loansFetcher from './loansFetcher';
import pairsJob from './pairsJob';
import borrowsFetcher from './borrowsFetcher';
import reservesJob from './reservesJob';

export const jobs: Job[] = [pairsJob, reservesJob];
export const fetchers: Fetcher[] = [loansFetcher, borrowsFetcher];
