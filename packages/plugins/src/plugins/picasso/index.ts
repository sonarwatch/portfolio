import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import unstakingNftsJob from './unstakingNftsJob';
import unstakingPositionsFetcher from './unstakingPositionsFetcher';

export const jobs: Job[] = [unstakingNftsJob];
export const fetchers: Fetcher[] = [unstakingPositionsFetcher];
