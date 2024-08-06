import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import {
  stepFinancePlatform,
  allbridgePlatform,
  ligmaPlatform,
} from './constants';
import xStakingJob from './stakingJob';

export const platforms: Platform[] = [
  stepFinancePlatform,
  allbridgePlatform,
  ligmaPlatform,
];
export const jobs: Job[] = [xStakingJob];
export const fetchers: Fetcher[] = [];
