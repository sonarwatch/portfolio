import { Fetcher, Job, NetworkId } from '@sonarwatch/portfolio-core';
import jobExecutor from './jobExecutor';
import fetcherExecutor from './fetcherExecutor';

export const jobs: Job[] = [
  {
    id: 'marginfi',
    executor: jobExecutor,
  },
];

export const fetchers: Fetcher[] = [
  {
    id: 'marginfi',
    networkId: NetworkId.solana,
    executor: fetcherExecutor,
  },
];
