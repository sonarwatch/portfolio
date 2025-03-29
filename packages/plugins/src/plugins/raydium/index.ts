import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lpTokensApiJob from './ammV2ApiJob';
import clmmJob from './clmmJob';
import cpmmJob from './cpmmJob';
import farmsJob from './farmsJob';
import farmsFetcher from './farmsFetcher';

export const jobs: Job[] = [lpTokensApiJob, farmsJob, clmmJob, cpmmJob];
export const fetchers: Fetcher[] = [farmsFetcher];
