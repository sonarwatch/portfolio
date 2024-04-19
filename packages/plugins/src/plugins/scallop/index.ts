import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import poolsJob from './poolsJob';
import addressJob from './addressJob';
import marketJob from './marketJob';
import spoolsMarketJob from './spoolsMarketJob';

import lendingsFetcher from './lendingsFetcher';
import veScaFetcher from './veScaFetcher';
import obligationsFetcher from './obligationsFetcher';
import { platform } from './constants';

export const jobs: Job[] = [addressJob, poolsJob, marketJob, spoolsMarketJob];
export const fetchers: Fetcher[] = [
  lendingsFetcher,
  obligationsFetcher,
  veScaFetcher,
];
export const platforms: Platform[] = [platform];
