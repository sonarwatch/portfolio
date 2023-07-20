import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import reservesJob from './reservesJob';
import marketsJob from './marketsJob';
import obligationFetcher from './obligationsFetcher';

export const jobs: Job[] = [reservesJob, marketsJob];
export const fetchers: Fetcher[] = [obligationFetcher];
