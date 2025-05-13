import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lpTokensApiJob from './ammV2ApiJob';
import clmmJob from './clmmJob';
import cpmmJob from './cpmmJob';
import farmsJob from './farmsJob';
import farmsFetcher from './farmsFetcher';
import farmsV6Fetcher from './farmsV6Fetcher';
import farmsV6Job from './farmsV6Job';

export const jobs: Job[] = [
  lpTokensApiJob,
  farmsJob,
  farmsV6Job,
  clmmJob,
  cpmmJob,
];
export const fetchers: Fetcher[] = [farmsFetcher, farmsV6Fetcher];
