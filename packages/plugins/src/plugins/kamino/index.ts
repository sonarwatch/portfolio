import { Fetcher } from '../../Fetcher';
import { AirdropFetcher } from '../../AirdropFetcher';
import { Job } from '../../Job';
import poolsJob from './poolsJob';
import farmsJob from './farmsJob';
import reservesJob from './reservesJob';
import marketsJob from './marketsJob';
import lendsFetcher from './lendsFetcher';
import farmsFetcher from './farmsFetcher';
import {
  airdropFetcher as s1AirdropFetcher,
  fetcher as s1Fetcher,
} from './s1AirdropFetcher';
import {
  airdropFetcher as s2AirdropFetcher,
  fetcher as s2Fetcher,
} from './s2AirdropFetcher';
import {
  airdropFetcher as s3AirdropFetcher,
  fetcher as s3Fetcher,
} from './s3AirdropFetcher';
import ordersFetcher from './ordersFetcher';
import vaultsJob from './vaultsJob';

export const jobs: Job[] = [
  poolsJob,
  reservesJob,
  farmsJob,
  marketsJob,
  vaultsJob,
];
export const fetchers: Fetcher[] = [
  lendsFetcher,
  farmsFetcher,
  s1Fetcher,
  s2Fetcher,
  s3Fetcher,
  ordersFetcher,
];
export const airdropFetchers: AirdropFetcher[] = [
  s1AirdropFetcher,
  s2AirdropFetcher,
  s3AirdropFetcher,
];
