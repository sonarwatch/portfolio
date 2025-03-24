import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import positionsFetcher from './positionsFetcher';
import lendVaultsFetcher from './lendVaultsFetcher';
import vaultsJob from './vaultsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [vaultsJob];
export const fetchers: Fetcher[] = [positionsFetcher, lendVaultsFetcher];
