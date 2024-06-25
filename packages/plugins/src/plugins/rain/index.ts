import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import poolsFetcher from './poolsFetcher';
import loansFetcher from './loansFetcher';
import collectionsJob from './collectionsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [collectionsJob];
export const fetchers: Fetcher[] = [poolsFetcher, loansFetcher];
