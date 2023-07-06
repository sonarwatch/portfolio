import { Job, NetworkId } from '@sonarwatch/portfolio-core';
import { wallettokensPlatform } from '../../platforms';
import jobExecutorGenerator from './jobExecutorGenerator';

export const jobs: Job[] = [
  {
    id: `${wallettokensPlatform.id}-${NetworkId.solana}`,
    executor: jobExecutorGenerator(NetworkId.solana),
  },
  {
    id: `${wallettokensPlatform.id}-${NetworkId.ethereum}`,
    executor: jobExecutorGenerator(NetworkId.ethereum),
  },
  {
    id: `${wallettokensPlatform.id}-${NetworkId.avalanche}`,
    executor: jobExecutorGenerator(NetworkId.avalanche),
  },
];
console.log('jobs:', jobs);
