import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import poolsV2Fetcher from './poolsV2Fetcher';
import poolsV3Fetcher from './poolsV3Fetcher';
import poolsV3StatsJob from './poolsV3StatsJob';
import poolsFarmsV2Job from './poolsFarmsV2Job';
import poolsFarmsV2Fetcher from './poolsFarmsV2Fetcher';
import strategyLpRebalancingJob from './strategyLpRebalancingJob';
import strategyLpRebalancingFetcher from './strategyLpRebalancingFetcher';
import strategyLeverageLendingJob from './strategyLeverageLendingJob';
import strategyLeverageLendingFetcher from './strategyLeverageLendingFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [
  poolsFarmsV2Job,
  poolsV3StatsJob,
  strategyLpRebalancingJob,
  strategyLeverageLendingJob,
];
export const fetchers: Fetcher[] = [
  poolsV2Fetcher,
  poolsFarmsV2Fetcher,
  poolsV3Fetcher,
  strategyLpRebalancingFetcher,
  strategyLeverageLendingFetcher,
];
