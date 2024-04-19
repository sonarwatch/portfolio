import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { kaiPlatform } from './constants';
import vaultsJob from './vaultsJob';

export const platforms: Platform[] = [kaiPlatform];
export const jobs: Job[] = [vaultsJob];
export const fetchers: Fetcher[] = [];
