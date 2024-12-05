import { Platform } from '@sonarwatch/portfolio-core';
import vaultsJob from './vaultsJob';
import poolsJob from './poolsJob';
import multiTokenPoolsJob from './multiTokenPoolsJob';
import farmsJob from './farmsJob';
import dlmmVaultsJob from './dlmmVaultsJob';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import { platform } from './constants';
import farmsFetcher from './farmsFetcher';
import dlmmPositionFetcher from './dlmmPositionsFetcher';
import dlmmVaultsFetcher from './dlmmVaultsFetcher';
import stakeForFeeFetcher from './stakeForFeeFetcher';
import stakeForFeeVaultsJob from './stakeForFeeVaultsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [
  vaultsJob,
  poolsJob,
  farmsJob,
  multiTokenPoolsJob,
  dlmmVaultsJob,
  stakeForFeeVaultsJob,
];
export const fetchers: Fetcher[] = [
  farmsFetcher,
  dlmmPositionFetcher,
  dlmmVaultsFetcher,
  stakeForFeeFetcher,
];
