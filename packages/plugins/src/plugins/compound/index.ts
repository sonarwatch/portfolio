import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { fooPlatform } from './constants';
import marketsJob from './marketsJob';
import getPositionsV3Fetcher from './getPositionsV3Fetcher';

export const platforms: Platform[] = [fooPlatform];
export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [
  getPositionsV3Fetcher(NetworkId.ethereum),
  getPositionsV3Fetcher(NetworkId.polygon),
];
