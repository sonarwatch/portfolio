import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import poolsJob from './poolsJob';
import clmmPositionFetcher from './clmmsPositionsFetcher';
import clmmVaultFetcher from './clmmVaultFetcher';
import { platform } from './constants';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [clmmPositionFetcher, clmmVaultFetcher];
