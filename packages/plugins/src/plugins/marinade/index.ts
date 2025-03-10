import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import ticketsFetcher from './ticketsFetcher';
import rewardsS1Fetcher from './rewardsS1Fetcher';
import { platform } from './constants';

export const jobs: Job[] = [];
export const platforms: Platform[] = [platform];

export const fetchers: Fetcher[] = [
  ticketsFetcher,
  rewardsS1Fetcher,
  // rewardsS2Fetcher,
];
