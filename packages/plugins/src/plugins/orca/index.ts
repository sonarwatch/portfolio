// import lpJob from './lpTokensJob';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import whirlpoolJob from './whirlpoolsJob';
// import clmmPositionsFetcher from './clmmPositionsFetcher';

export const jobs: Job[] = [whirlpoolJob];
export const fetchers: Fetcher[] = [
  // clmmPositionsFetcher
];
