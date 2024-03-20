import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import poolsJob from './poolsJob';
import addressJob from './addressJob';
import marketJob from './marketJob';
import spoolsMarketJob from './spoolsMarketJob';

import lendingsFetcher from './lendingsFetcher';
import veScasFetcher from './veScasFetcher';
import obligationsFetcher from './obligationsFetcher';
import { scallopPlatform } from './constants';

export const jobs: Job[] = [addressJob, poolsJob, marketJob, spoolsMarketJob];
export const fetchers: Fetcher[] = [
  lendingsFetcher,
  obligationsFetcher,
  veScasFetcher,
];
export const platforms: Platform[] = [scallopPlatform];
