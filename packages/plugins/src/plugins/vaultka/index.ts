import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lendingJob from './lendingJob';
import lendingV1Fetcher from './lendingV1Fetcher';
import strategyFetcher from './strategyV1Fetcher';
import strategyJob from './strategyJob';
import banksJon from './banksJob';
import lendingV2Fetcher from './lendingV2Fetcher';

export const jobs: Job[] = [lendingJob, strategyJob, banksJon];
export const fetchers: Fetcher[] = [
  lendingV1Fetcher,
  strategyFetcher,
  lendingV2Fetcher,
];
