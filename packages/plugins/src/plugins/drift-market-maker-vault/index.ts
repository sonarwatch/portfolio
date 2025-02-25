import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import {
  circuitPlatform,
  gauntletPlatform,
  hedgyPlatform,
  knightradePlatform,
  luckyperpPlatform,
  m1CapitalPlatform,
  moosePlatform,
  neutralPlatform,
  vectisPlatform,
} from './constants';
import depositsFetcher from './depositsFetcher';
import vaultsJob from './vaultsJob';

export const platforms: Platform[] = [
  circuitPlatform,
  gauntletPlatform,
  hedgyPlatform,
  knightradePlatform,
  luckyperpPlatform,
  m1CapitalPlatform,
  moosePlatform,
  neutralPlatform,
  vectisPlatform,
];
export const jobs: Job[] = [vaultsJob];
export const fetchers: Fetcher[] = [depositsFetcher];
