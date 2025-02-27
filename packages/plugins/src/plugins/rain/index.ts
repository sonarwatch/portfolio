import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import collectionsJob from './collectionsJob';
import defiLoansFetcher from './defiLoansFetcher';
import poolsFetcher from './poolsFetcher';
import banksFetcher from './banksFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [collectionsJob];
export const fetchers: Fetcher[] = [
  defiLoansFetcher,
  poolsFetcher,
  banksFetcher,
];
