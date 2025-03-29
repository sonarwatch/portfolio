import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import marketsJob from './poolsJob';

export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [];
