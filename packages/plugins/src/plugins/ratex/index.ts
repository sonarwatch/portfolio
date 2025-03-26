import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import positionsFetcher from './positionsFetcher';
import marketsJob from './marketsJob';
import ptPricesJob from './ptPricesJob';

export const jobs: Job[] = [marketsJob, ptPricesJob];
export const fetchers: Fetcher[] = [positionsFetcher];
