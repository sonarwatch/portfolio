import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import reservesJob from './reservesJob';
import marketsJob from './marketsJob';
import obligationFetcher from './obligationsFetcher';

export const jobs: Job[] = [marketsJob, reservesJob];
export const fetchers: Fetcher[] = [obligationFetcher];
