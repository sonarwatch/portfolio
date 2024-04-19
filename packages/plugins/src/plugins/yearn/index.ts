import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { lockersEth, yearnPlatform, styETHStake, yETHStake } from './constants';
import getVaultsJob from './getVaultsJob';
import getVaultsBalancesFetcher from './getVaultsBalancesFetcher';
import getLockersBalancesFetcher from './getLockersBalancesFetcher';
import getStakesBalancesFetcher from './getStakesBalancesFetcher';
import getYearnStakeBalancesFetcher from './getYearnStakeBalancesFetcher';

export const platforms: Platform[] = [yearnPlatform];
export const jobs: Job[] = [getVaultsJob(NetworkId.ethereum, yearnPlatform.id)];
export const fetchers: Fetcher[] = [
  getVaultsBalancesFetcher(NetworkId.ethereum, yearnPlatform.id),
  getLockersBalancesFetcher(NetworkId.ethereum, yearnPlatform.id, lockersEth),
  getStakesBalancesFetcher(NetworkId.ethereum, yearnPlatform.id, yETHStake),
  getYearnStakeBalancesFetcher(
    NetworkId.ethereum,
    yearnPlatform.id,
    styETHStake
  ),
];
