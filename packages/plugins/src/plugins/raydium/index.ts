import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lpTokensJob from './lpTokensJob';
import clmmJob from './clmmJob';
import cpmmJob from './cpmmJob';
import farmsJob from './farmsJob';
import { platform } from './constants';
import stakingFetcher from './stakingFetcher';
import farmsFetcher from './farmsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lpTokensJob, farmsJob, clmmJob, cpmmJob];
export const fetchers: Fetcher[] = [stakingFetcher, farmsFetcher];
