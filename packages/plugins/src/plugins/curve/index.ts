import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { CrvNetworkId, fooPlatform } from './constants';
import poolsJob from './poolsJob';
import gaugesJob from './gaugesJob';
import { getPositionsFetcher } from './getPositionsFetcher';
import votingEscrowFetcher from './votingEscrowFetcher';
import vestingEscrowFetcher from './vestingEscrowFetcher';

export const platforms: Platform[] = [fooPlatform];
export const jobs: Job[] = [poolsJob, gaugesJob];
export const fetchers: Fetcher[] = [
  getPositionsFetcher(CrvNetworkId.ethereum),
  getPositionsFetcher(CrvNetworkId.polygon),
  getPositionsFetcher(CrvNetworkId.avalanche),
  votingEscrowFetcher,
  vestingEscrowFetcher,
];
