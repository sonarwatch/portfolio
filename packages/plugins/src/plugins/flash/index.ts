import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
// import perpetualFetcher from './perpetualFetcher';
import custodiesJob from './custodiesJob';
import poolsJob from './poolJob';
import stakeFetcher from './stakeFetcher';
import fafStakingFetcher from './fafStakingFetcher';

export const jobs: Job[] = [custodiesJob, poolsJob];
export const fetchers: Fetcher[] = [
  // perpetualFetcher,
  stakeFetcher,
  fafStakingFetcher,
];
