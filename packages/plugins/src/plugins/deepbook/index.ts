import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import { airdropFetcher } from './airdropFetcher';
import ordersFetcher from './ordersFetcher';
import poolsJob from './poolsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [ordersFetcher];
export { airdropFetcher };
