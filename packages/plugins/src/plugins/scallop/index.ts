import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import { platform } from './constants';

import marketJob from './scallopJob';
import lendingsFetcher from './lendingsFetcher';
import veScaFetcher from './veScaFetcher';
import obligationsFetcher from './obligationsFetcher';
import cnyAidropFetcher from './cnyAirdropFetcher';
import christmasAirdropFetcher from './christmasAirdropFetcher';

export const jobs: Job[] = [marketJob];
export const fetchers: Fetcher[] = [
  lendingsFetcher,
  obligationsFetcher,
  veScaFetcher,
  cnyAidropFetcher,
  christmasAirdropFetcher,
];
export const platforms: Platform[] = [platform];
