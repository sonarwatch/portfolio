import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { whalesMarketPlatform, stepFinancePlatform } from './constants';
import xStakingJob from './stakingJob';

export const platforms: Platform[] = [
  whalesMarketPlatform,
  stepFinancePlatform,
];
export const jobs: Job[] = [xStakingJob];
export const fetchers: Fetcher[] = [];
