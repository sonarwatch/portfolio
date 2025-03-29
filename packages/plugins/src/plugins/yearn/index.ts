import { NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { lockersEth, platformId, styETHStake, yETHStake } from './constants';
import getVaultsJob from './getVaultsJob';
import getVaultsBalancesFetcher from './getVaultsBalancesFetcher';
import getLockersBalancesFetcher from './getLockersBalancesFetcher';
import getStakesBalancesFetcher from './getStakesBalancesFetcher';
import getYearnStakeBalancesFetcher from './getYearnStakeBalancesFetcher';

export const jobs: Job[] = [getVaultsJob(NetworkId.ethereum, platformId)];
export const fetchers: Fetcher[] = [
  getVaultsBalancesFetcher(NetworkId.ethereum, platformId),
  getLockersBalancesFetcher(NetworkId.ethereum, platformId, lockersEth),
  getStakesBalancesFetcher(NetworkId.ethereum, platformId, yETHStake),
  getYearnStakeBalancesFetcher(NetworkId.ethereum, platformId, styETHStake),
];
