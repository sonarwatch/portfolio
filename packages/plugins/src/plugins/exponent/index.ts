import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import ptPricesJob from './ptPricesJob';
import marketsJob from './marketsJob';
import liquidityFetcher from './liquidityFetcher';
import tradeFetcher from './tradeFetcher';

export const jobs: Job[] = [ptPricesJob, marketsJob];
export const fetchers: Fetcher[] = [tradeFetcher, liquidityFetcher];
