import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import vaultsFetcher from './vaultsFetcher';
import safuVaultsJob from './safuVaultsJob';
import safuFetcher from './safuFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [safuVaultsJob];
export const fetchers: Fetcher[] = [vaultsFetcher, safuFetcher];
