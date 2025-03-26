import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import reservesJob from './reservesJob';
import marketsJob from './marketsJob';
import obligationFetcher from './obligationsFetcher';
import token2022wrapperJob from './token2022wrapperJob';

export const jobs: Job[] = [marketsJob, reservesJob, token2022wrapperJob];
export const fetchers: Fetcher[] = [obligationFetcher];
