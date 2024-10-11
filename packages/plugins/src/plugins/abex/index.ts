import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import marketsJob from './marketsJob';
import stakingFetcher from './stakingFetcher';
import positionsFetcher from './positionsFetcher';
import ordersFetcher from './ordersFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [
  stakingFetcher,
  positionsFetcher,
  ordersFetcher,
];
