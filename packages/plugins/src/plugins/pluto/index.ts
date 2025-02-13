import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';

import leverageAddressesJob from './leverageAddressesJob';
import leverageFetcher from './leverageFetcher';
import earnFetcher from './earnFetcher';
import earnVaultsJob from './earnVaultsJob';
import leverageVaultsJob from './leverageVaultsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [earnVaultsJob, leverageVaultsJob, leverageAddressesJob];
export const fetchers: Fetcher[] = [earnFetcher, leverageFetcher];
