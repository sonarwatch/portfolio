import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import positionFetcher from './positionFetcher';
import daoJob from './daoJob';
import daoFetcher from './daoFetcher';

export const jobs: Job[] = [daoJob];
export const fetchers: Fetcher[] = [positionFetcher, daoFetcher];
