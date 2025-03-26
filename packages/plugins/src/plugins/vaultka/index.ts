import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lendingJob from './lendingJob';
import lendingFetcher from './lendingFetcher';
import strategyFetcher from './strategyFetcher';
import strategyJob from './strategyJob';

export const jobs: Job[] = [lendingJob, strategyJob];
export const fetchers: Fetcher[] = [lendingFetcher, strategyFetcher];
