import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import topTokensJob from './topTokensJob';

export const jobs: Job[] = [topTokensJob];
export const fetchers: Fetcher[] = [];
