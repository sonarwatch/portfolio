import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import ticketsFetcher from './ticketsFetcher';
import rewardsS2Fetcher from './rewardsS2Fetcher';
import rewardsS1Fetcher from './rewardsS1Fetcher';
import { marinadePlatform } from './constants';

export const platforms: Platform[] = [marinadePlatform];
export const fetchers: Fetcher[] = [
  ticketsFetcher,
  rewardsS1Fetcher,
  rewardsS2Fetcher,
];
