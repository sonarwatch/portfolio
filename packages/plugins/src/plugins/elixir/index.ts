import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import vaultsJob from './vaultsJob';
import positionsFetcher from './positionsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [vaultsJob];
export const fetchers: Fetcher[] = [positionsFetcher];
