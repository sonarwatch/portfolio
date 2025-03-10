import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import { airdropFetcher, fetcher as s1Fetcher } from './airdropFetcher';
import poolsV2Job from './v2/poolsJob';
import depositsV2Fetcher from './v2/depositsFetcher';
import poolsV3Job from './v3/poolsJob';
import depositsV3Fetcher from './v3/depositsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolsV2Job, poolsV3Job];
export const fetchers: Fetcher[] = [
  depositsV2Fetcher,
  depositsV3Fetcher,
  s1Fetcher,
];
export { airdropFetcher };
export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
