import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import spotMarketsJob from './spotMarketsJob';
import spotPositionsFetcher from './spotPositionsFetcher';

export const jobs: Job[] = [spotMarketsJob];
export const fetchers: Fetcher[] = [spotPositionsFetcher];
