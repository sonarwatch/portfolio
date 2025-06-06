import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import programCacheJob from './programsCacheJob';

export const jobs: Job[] = [programCacheJob];
export const fetchers: Fetcher[] = [];
