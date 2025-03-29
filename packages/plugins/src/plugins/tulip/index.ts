import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import strategyTokensJob from './strategyTokensJob';
import lendingTokensJob from './lendingTokensJob';
import depositsFetcher from './depositsFetcher';

export const jobs: Job[] = [strategyTokensJob, lendingTokensJob];
export const fetchers: Fetcher[] = [depositsFetcher];
