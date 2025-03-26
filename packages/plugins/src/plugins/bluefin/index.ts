import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import poolFetcher from './poolFetcher';
import poolJob from './poolJob';
import bankFetcher from './bankFetcher';
import positionFetcher from './positionFetcher';
import perpsJob from './perpsJob';
import clmmsFetcher from './clmmsFetcher';
import clmmsJob from './clmmsJob';
import { airdropFetcher } from './airdropFetcher';

export const jobs: Job[] = [poolJob, perpsJob, clmmsJob];
export const fetchers: Fetcher[] = [
  poolFetcher,
  bankFetcher,
  positionFetcher,
  clmmsFetcher,
];

export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
