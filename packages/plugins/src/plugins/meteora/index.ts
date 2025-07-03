import vaultsJob from './vaultsJob';
import poolsJob from './pools/poolsJob';
import multiTokenPoolsJob from './multiTokenPools/multiTokenPoolsJob';
import farmsJob from './pools/farmsJob';
import dlmmVaultsJob from './dlmm/dlmmVaultsJob';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import farmsFetcher from './pools/farmsFetcher';
import dlmmPositionFetcher from './dlmm/dlmmPositionsFetcher';
import dlmmVaultsFetcher from './dlmm/dlmmVaultsFetcher';
import stakeForFeeFetcher from './stake2earn/stakeForFeeFetcher';
import stakeForFeeVaultsJob from './stake2earn/stakeForFeeVaultsJob';
import dammV2Job from './cpamm/cpammV2Job';
import dlmmJob from './dlmm/dlmmJob';
import pricingDbcJob from './dbc/pricingDbcJob';

export const jobs: Job[] = [
  vaultsJob,
  poolsJob,
  farmsJob,
  multiTokenPoolsJob,
  dlmmJob,
  dlmmVaultsJob,
  stakeForFeeVaultsJob,
  dammV2Job,
  pricingDbcJob,
];
export const fetchers: Fetcher[] = [
  farmsFetcher,
  dlmmPositionFetcher,
  dlmmVaultsFetcher,
  stakeForFeeFetcher,
];
