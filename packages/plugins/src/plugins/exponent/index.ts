import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import ptPricesJob from './ptPricesJob';
import marketsJob from './marketsJob';
import liquidityFetcher from './liquidityFetcher';
import tradeFetcher from './tradeFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [ptPricesJob, marketsJob];
export const fetchers: Fetcher[] = [tradeFetcher, liquidityFetcher];
