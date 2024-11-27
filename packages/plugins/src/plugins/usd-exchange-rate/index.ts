import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import usdExchangeRateJob from './usdExchangeRateJob';

export const platforms: Platform[] = [];
export const jobs: Job[] = [usdExchangeRateJob];
export const fetchers: Fetcher[] = [];
