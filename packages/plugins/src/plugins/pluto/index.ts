import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';

import leverageFetcher from './leverageFetcher';
import earnFetcher from './earnFetcher';
import earnVaultsJob from './earnVaultsJob';
import leverageVaultsJob from './leverageVaultsJob';
import leverageVaultsApiJob from './leverageVaultsApiJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [
  earnVaultsJob,
  leverageVaultsJob,
  leverageVaultsApiJob,
];
export const fetchers: Fetcher[] = [earnFetcher, leverageFetcher];
