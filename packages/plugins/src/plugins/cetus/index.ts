import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import poolsJob from './poolsJob';
import clmmPositionFetcher from './clmmsFetcher';
import { cetusPlatform } from './constants';

export const platforms: Platform[] = [cetusPlatform];
export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [clmmPositionFetcher];
