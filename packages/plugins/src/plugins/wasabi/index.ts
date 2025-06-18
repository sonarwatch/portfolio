import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lpVaultsJob from './lpVaultsJob';
// import depositsFetcher from './positionsFetcher';

export const jobs: Job[] = [lpVaultsJob];
export const fetchers: Fetcher[] = [
  //  depositsFetcher
];
