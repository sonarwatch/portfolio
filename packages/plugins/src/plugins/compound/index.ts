import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform, comptrollerV2Ethereum, platformId } from './constants';
import marketsJob from './marketsJob';
import getPositionsV3Fetcher from './getPositionsV3Fetcher';
import getMarketsV2Job from './getMarketsV2Job';
import getPositionsV2Fetcher from './getPositionsV2Fetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [
  marketsJob,
  getMarketsV2Job(NetworkId.ethereum, platformId, comptrollerV2Ethereum),
];
export const fetchers: Fetcher[] = [
  getPositionsV3Fetcher(NetworkId.ethereum),
  getPositionsV3Fetcher(NetworkId.polygon),
  getPositionsV2Fetcher(NetworkId.ethereum, platformId),
];
