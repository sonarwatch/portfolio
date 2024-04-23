import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import ticketsFetcher from './ticketsFetcher';
import rewardsS1Fetcher from './rewardsS1Fetcher';
import { platform } from './constants';

export const platforms: Platform[] = [platform];
export const fetchers: Fetcher[] = [
  ticketsFetcher,
  rewardsS1Fetcher,
  // rewardsS2Fetcher,
];
