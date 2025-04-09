import { NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';

import { getLendingFetcher } from './lendingFetcher';
import { getYieldFetcher } from './yieldFetcher';
import { getRewardsFetcher } from './rewardsFetcher';

import { marketsJob } from './marketsJob';
import { vaultsJob } from './vaultsJob';

export const jobs: Job[] = [
  marketsJob(NetworkId.ethereum),
  vaultsJob(NetworkId.ethereum),
];
export const fetchers: Fetcher[] = [
  getLendingFetcher(NetworkId.ethereum),
  getYieldFetcher(NetworkId.ethereum),
  getRewardsFetcher(NetworkId.ethereum),
];
