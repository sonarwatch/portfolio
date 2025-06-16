import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import unstakingNftsJob from './unstakingNftsJob';
import unstakingPositionsFetcher from './unstakingPositionsFetcher';
import positionsFetcher from './positionsFetcher';

export const jobs: Job[] = [unstakingNftsJob];
export const fetchers: Fetcher[] = [
  unstakingPositionsFetcher,
  positionsFetcher,
];
