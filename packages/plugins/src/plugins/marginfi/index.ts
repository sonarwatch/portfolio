import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import jobExecutor from './jobExecutor';
import fetcherExecutor from './fetcherExecutor';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import { marginfiPlatform } from './constants';

export const platforms: Platform[] = [marginfiPlatform];
export const jobs: Job[] = [
  {
    id: 'marginfi',
    executor: jobExecutor,
    label: 'normal',
  },
];

export const fetchers: Fetcher[] = [
  {
    id: 'marginfi',
    networkId: NetworkId.solana,
    executor: fetcherExecutor,
  },
];
