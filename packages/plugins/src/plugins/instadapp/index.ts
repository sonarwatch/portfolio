import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { liteConfigs, platform } from './constants';
import liteJob from './liteJob';
import getEvmLpFetcher from '../../utils/evm/getEvmLpFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [liteJob];
export const fetchers: Fetcher[] = [
  getEvmLpFetcher(
    `${platform.id}-lite-lp`,
    NetworkId.ethereum,
    liteConfigs.map((lc) => lc.address)
  ),
];
