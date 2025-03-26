import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './depositsFetcher';
import farmsFetcher from './farmsFetcher';
import farmsJob from './farmsJob';
import dataJob from './dataJob';

export const jobs: Job[] = [dataJob, farmsJob];
export const fetchers: Fetcher[] = [depositsFetcher, farmsFetcher];
