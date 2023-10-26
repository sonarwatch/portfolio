import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import stakingFetcher from './stakingFetcher';
import bptFarmingFetcher from './bptFarmingFetcher';
import bptStakingFetcher from './bptStakingFetcher';
import bptInfoJob from './bptInfoJob';
import { paraswapPlatform } from './constants';

export const jobs: Job[] = [bptInfoJob];
export const fetchers: Fetcher[] = [
  stakingFetcher,
  bptFarmingFetcher,
  bptStakingFetcher,
];
export const platforms: Platform[] = [paraswapPlatform];
