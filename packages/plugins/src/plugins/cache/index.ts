import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import programCacheJob from './programsCacheJob';
export { programs as cachedPrograms } from './constants'

export const jobs: Job[] = [programCacheJob];
export const fetchers: Fetcher[] = [];
