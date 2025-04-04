import { NetworkId } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import siloJob from './siloJob';
import siloFetcher from './siloFetcher';
import siloRewardFetcher from './siloRewardFetcher';

export const jobs: Job[] = [siloJob()];
export const fetchers: Fetcher[] = [
  siloFetcher(NetworkId.ethereum),
  siloRewardFetcher(NetworkId.ethereum),
];
