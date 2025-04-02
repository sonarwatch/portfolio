import { NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import aaveV3CollateralFetcher from './aaveV3CollateralFetcher';
import aaveV3SupplyOnlyFetcher from './aaveV3SupplyOnlyFetcher';
import aaveV3Job from './aaveV3Job';
import { getLendingFetcher } from './lendingFetcher';
import { getYieldFetcher } from './yieldFetcher';
import { marketsJob } from './marketsJob';
import { vaultsJob } from './vaultsJob';

export const jobs: Job[] = [
  aaveV3Job,
  marketsJob(NetworkId.ethereum),
  vaultsJob(NetworkId.ethereum),
];
export const fetchers: Fetcher[] = [
  aaveV3CollateralFetcher,
  aaveV3SupplyOnlyFetcher,
  getLendingFetcher(NetworkId.ethereum),
  getYieldFetcher(NetworkId.ethereum),
];
