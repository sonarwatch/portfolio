import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lpTokensJob from './lpTokensJob';
// import clmmPositionsFetcher from './clmmPositionsFetcher';

export const jobs: Job[] = [lpTokensJob];
export const fetchers: Fetcher[] = [
  // clmmPositionsFetcher
];
