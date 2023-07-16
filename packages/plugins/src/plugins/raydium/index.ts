import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import lpTokensJob from './lpTokensJob';
// import clmmPositionsFetcher from './clmmPositionsFetcher';

export const jobs: Job[] = [lpTokensJob];
export const fetchers: Fetcher[] = [
  // clmmPositionsFetcher
];
