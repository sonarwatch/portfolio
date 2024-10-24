import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import poolsJob from './poolsJob';
import addressJob from './addressJob';
import marketJob from './marketJob';
import spoolsMarketJob from './spoolsMarketJob';
import sCoinJob from './sCoinJob';

import lendingsFetcher from './lendingsFetcher';
import veScaFetcher from './veScaFetcher';
import obligationsFetcher from './obligationsFetcher';
import cnyAidropFetcher from './cnyAirdropFetcher';
import { platform } from './constants';

export const jobs: Job[] = [
  addressJob,
  sCoinJob,
  poolsJob,
  marketJob,
  spoolsMarketJob,
];
export const fetchers: Fetcher[] = [
  lendingsFetcher,
  obligationsFetcher,
  veScaFetcher,
  cnyAidropFetcher,
];
export const platforms: Platform[] = [platform];
