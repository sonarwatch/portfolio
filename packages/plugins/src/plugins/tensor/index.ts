import { Fetcher, NetworkId } from '@sonarwatch/portfolio-core';
import fetcherExecutor from './fetcherExecutor';

export const fetchers: Fetcher[] = [
  {
    id: 'tensor',
    networkId: NetworkId.solana,
    executor: fetcherExecutor,
  },
];
