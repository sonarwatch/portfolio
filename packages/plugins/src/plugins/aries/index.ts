import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './depositsFetcher';
import reserveJob from './reservesJob';

export const jobs: Job[] = [reserveJob];
export const fetchers: Fetcher[] = [depositsFetcher];
