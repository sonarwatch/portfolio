import { NetworkId } from '@sonarwatch/portfolio-core';
import jobExecutor from './jobExecutor';
import fetcherExecutor from './fetcherExecutor';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';

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
