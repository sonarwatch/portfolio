import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { getPoolsPositionsFetcher } from './gePoolPositionsFetcher';
import poolsJob from './poolsJob';
import farmsJob from './farmsJob';
import { stargatePlatform, stargateNetworksConfigs } from './constants';
import { getFarmsPositionsFetcher } from './getFarmPositionsFetcher';
import { getVoteTokensFetcher } from './getVoteTokensFetcher';

export const jobs: Job[] = [poolsJob, farmsJob];
export const fetchers: Fetcher[] = [
  ...stargateNetworksConfigs
    .map((config) => [
      getPoolsPositionsFetcher(config),
      getFarmsPositionsFetcher(config),
      getVoteTokensFetcher(config),
    ])
    .flat(),
];
export const platforms: Platform[] = [stargatePlatform];
