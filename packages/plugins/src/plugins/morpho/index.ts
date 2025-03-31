import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import aaveV3CollateralFetcher from './aaveV3CollateralFetcher';
import aaveV3SupplyOnlyFetcher from './aaveV3SupplyOnlyFetcher';
import aaveV3Job from './aaveV3Job';
import { fetcher } from './morphoFetcher';

export const jobs: Job[] = [aaveV3Job];
export const fetchers: Fetcher[] = [
  aaveV3CollateralFetcher,
  aaveV3SupplyOnlyFetcher,
  fetcher,
];
