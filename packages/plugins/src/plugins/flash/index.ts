import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import perpetualFetcher from './perpetualFetcher';
import custodiesJob from './custodiesJob';
import poolsJob from './poolsJob';
import stakeFetcher from './stakeFetcher';
import fafStakingFetcher from './fafStakingFetcher';
import poolsYieldJob from './poolsYieldJob';

export const jobs: Job[] = [custodiesJob, poolsJob, poolsYieldJob];
export const fetchers: Fetcher[] = [
  perpetualFetcher,
  stakeFetcher,
  fafStakingFetcher,
];
