import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import positionsFetcher from './positionsFetcher';
import marketsJob from './marketsJob';
import ptPricesJob from './ptPricesJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [marketsJob, ptPricesJob];
export const fetchers: Fetcher[] = [positionsFetcher];
