import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import {
  circuitPlatform,
  gauntletPlatform,
  hedgyPlatform,
  moosePlatform,
  neutralPlatform,
  vectisPlatform,
} from './constants';
import depositsFetcher from './depositsFetcher';
import vaultsJob from './vaultsJob';

export const platforms: Platform[] = [
  circuitPlatform,
  moosePlatform,
  neutralPlatform,
  gauntletPlatform,
  hedgyPlatform,
  vectisPlatform,
];
export const jobs: Job[] = [vaultsJob];
export const fetchers: Fetcher[] = [depositsFetcher];
