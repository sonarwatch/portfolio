import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import ticketsFetcher from './ticketsFetcher';
import rewardsS1Fetcher from './rewardsS1Fetcher';

export const jobs: Job[] = [];

export const fetchers: Fetcher[] = [
  ticketsFetcher,
  rewardsS1Fetcher,
  // rewardsS2Fetcher,
];
