import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import poolsJob from './poolsJob';
import clmmPositionFetcher from './clmmsFetcher';
import { platform } from './constants';
import vaultsJob from './vaultsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolsJob, vaultsJob];
export const fetchers: Fetcher[] = [clmmPositionFetcher];
