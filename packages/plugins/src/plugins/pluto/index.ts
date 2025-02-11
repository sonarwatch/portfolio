import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';

import leverageJob from './leverageJob';
import leverageFetcher from './leverageFetcher';
import earnFetcher from './earnFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [leverageJob];
export const fetchers: Fetcher[] = [earnFetcher, leverageFetcher];
