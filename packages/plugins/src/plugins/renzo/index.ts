import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { renzoNetworkConfigs } from './constants';
import { getStakedPositionsFetcher } from './getPositionsFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [
  ...renzoNetworkConfigs.flatMap((config) => getStakedPositionsFetcher(config)),
];
