import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import fiatJob from './fiatJob';

export * from './constants';

export const jobs: Job[] = [fiatJob];
export const fetchers: Fetcher[] = [];
