import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';

import leverageFetcher from './leverageFetcher';
import earnFetcher from './earnFetcher';
import earnVaultsJob from './earnVaultsJob';
import leverageVaultsJob from './leverageVaultsJob';
import leverageVaultsApiJob from './leverageVaultsApiJob';

export const jobs: Job[] = [
  earnVaultsJob,
  leverageVaultsJob,
  leverageVaultsApiJob,
];
export const fetchers: Fetcher[] = [earnFetcher, leverageFetcher];
