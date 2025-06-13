import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { getPoolsPositionsFetcher } from './gePoolPositionsFetcher';
import { stargateNetworksConfigs } from './constants';
import { getFarmsPositionsFetcher } from './getFarmPositionsFetcher';
import { getVoteTokensFetcher } from './getVoteTokensFetcher';

export const jobs: Job[] = [
  // ...stargateNetworksConfigs.map((config) => getPoolsJob(config)),
  // ...stargateNetworksConfigs.map((config) => getFarmsJob(config)),
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
