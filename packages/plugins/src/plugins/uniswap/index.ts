import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';

import { platformId, uniswapNetworksConfigs, platform } from './constants';
import { getUniV3PositionsFetcher } from './getUniV3PositionsFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [
  ...uniswapNetworksConfigs.map((config) =>
    getUniV3PositionsFetcher(config, platformId, 'V3')
  ),
];
export const platforms: Platform[] = [platform];
