import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { getPoolsPositionsFetcher } from './gePoolPositionsFetcher';
import { getPoolsJob } from './getPoolsJob';
import farmsJob from './farmsJob';
import { platform, stargateNetworksConfigs } from './constants';
import { getFarmsPositionsFetcher } from './getFarmPositionsFetcher';
import { getVoteTokensFetcher } from './getVoteTokensFetcher';

export const jobs: Job[] = [
  ...stargateNetworksConfigs.map((config) => getPoolsJob(config)),
  farmsJob,
];
export const fetchers: Fetcher[] = [
  ...stargateNetworksConfigs
    .map((config) => [
      getPoolsPositionsFetcher(config),
      getFarmsPositionsFetcher(config),
      getVoteTokensFetcher(config),
    ])
    .flat(),
];
export const platforms: Platform[] = [platform];
