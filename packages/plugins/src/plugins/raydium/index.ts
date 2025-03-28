import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lpTokensApiJob from './ammV2ApiJob';
import clmmJob from './clmmJob';
import cpmmJob from './cpmmJob';
import farmsJob from './farmsJob';
import { platform } from './constants';
import farmsFetcher from './farmsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lpTokensApiJob, farmsJob, clmmJob, cpmmJob];
export const fetchers: Fetcher[] = [farmsFetcher];
