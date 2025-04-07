import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import poolsJob from './jobs/poolsJob';
import positionsFetcher from './fetchers/positionsFetcher';
import withdrawalsJob from './jobs/withdrawalsJob';

export const jobs: Job[] = [poolsJob, withdrawalsJob];
export const fetchers: Fetcher[] = [positionsFetcher];
