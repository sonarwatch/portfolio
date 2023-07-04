import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import solanaJobExecutor from './jobExecutors/solana';

export const jobs: Job[] = [
  {
    id: 'wallettokens-solana',
    executor: solanaJobExecutor,
  },
];
export const fetchers: Fetcher[] = [];
