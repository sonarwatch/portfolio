import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';

import {
  platformId,
  uniswapNetworksConfigs,
  uniswapPlatform,
} from './constants';
import { getPositionsV3Fetcher } from './getPositionsV3Fetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [
  ...uniswapNetworksConfigs.map((config) =>
    getPositionsV3Fetcher(config, platformId, 'V3')
  ),
];
export const platforms: Platform[] = [uniswapPlatform];
