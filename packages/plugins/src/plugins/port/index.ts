import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import pTokensJob from './pTokensJob';
import reserveJob from './reservesJob';
import obligationsFetcher from './obligationsFetcher';

export const jobs: Job[] = [pTokensJob, reserveJob];
export const fetchers: Fetcher[] = [obligationsFetcher];
