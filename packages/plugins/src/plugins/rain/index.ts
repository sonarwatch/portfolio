import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { rainPlatform } from './constants';
import poolsFetcher from './poolsFetcher';
import loansFetcher from './loansFetcher';

export const platforms: Platform[] = [rainPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [poolsFetcher, loansFetcher];
