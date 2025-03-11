import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import stakingFetcher from './stakingFetcher';
import marketsJob from './marketsJob';
import loansFetcher from './loansFetcher';
import offersFetcher from './offersFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [
  stakingFetcher,
  loansFetcher,
  offersFetcher,
];
