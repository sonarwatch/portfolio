import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import positionsFetcher from './positionsFetcher';
import locksJob from './locksJob';
import bidsJob from './bidsJob';
import bidsFetcher from './bidsFetcher';
import kioskProfitsFetcher from './kioskProfitsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [locksJob, bidsJob];
export const fetchers: Fetcher[] = [
  positionsFetcher,
  bidsFetcher,
  kioskProfitsFetcher,
];
