import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { lockersEth, platform, styETHStake, yETHStake } from './constants';
import getVaultsJob from './getVaultsJob';
import getVaultsBalancesFetcher from './getVaultsBalancesFetcher';
import getLockersBalancesFetcher from './getLockersBalancesFetcher';
import getStakesBalancesFetcher from './getStakesBalancesFetcher';
import getYearnStakeBalancesFetcher from './getYearnStakeBalancesFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [getVaultsJob(NetworkId.ethereum, platform.id)];
export const fetchers: Fetcher[] = [
  getVaultsBalancesFetcher(NetworkId.ethereum, platform.id),
  getLockersBalancesFetcher(NetworkId.ethereum, platform.id, lockersEth),
  getStakesBalancesFetcher(NetworkId.ethereum, platform.id, yETHStake),
  getYearnStakeBalancesFetcher(NetworkId.ethereum, platform.id, styETHStake),
];
