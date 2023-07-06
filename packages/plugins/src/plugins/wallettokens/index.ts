import { Fetcher, Job, NetworkId } from '@sonarwatch/portfolio-core';
import { wallettokensPlatform } from '../../platforms';
import jobExecutorGenerator from './jobExecutorGenerator';

export const jobs: Job[] = [
  {
    id: `${wallettokensPlatform}-${NetworkId.solana}`,
    executor: jobExecutorGenerator(NetworkId.solana),
  },
  {
    id: `${wallettokensPlatform}-${NetworkId.ethereum}`,
    executor: jobExecutorGenerator(NetworkId.ethereum),
  },
  {
    id: `${wallettokensPlatform}-${NetworkId.avalanche}`,
    executor: jobExecutorGenerator(NetworkId.avalanche),
  },
];
export const fetchers: Fetcher[] = [];
