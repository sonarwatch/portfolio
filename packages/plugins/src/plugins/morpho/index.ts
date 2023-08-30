import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import aaveV3CollateralFetcher from './aaveV3CollateralFetcher';
import aaveV3SupplyOnlyFetcher from './aaveV3SupplyOnlyFetcher';
import aaveV3Job from './aaveV3Job';
import { morphoPlatform } from './constants';

export const platforms: Platform[] = [morphoPlatform];
export const jobs: Job[] = [aaveV3Job];
export const fetchers: Fetcher[] = [
  aaveV3CollateralFetcher,
  aaveV3SupplyOnlyFetcher,
];
