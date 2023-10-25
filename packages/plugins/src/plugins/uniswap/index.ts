import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';

import { uniswapNetworksConfigs, uniswapPlatform } from './constants';
import { getPositionsV3Fetcher } from './getPositionsV3Fetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [
  ...uniswapNetworksConfigs.map((config) => getPositionsV3Fetcher(config)),
];
export const platforms: Platform[] = [uniswapPlatform];
