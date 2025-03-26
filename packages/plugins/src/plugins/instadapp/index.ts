import { NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { liteConfigs } from './constants';
import liteJob from './liteJob';
import getEvmLpFetcher from '../../utils/evm/getEvmLpFetcher';

export const jobs: Job[] = [liteJob];
export const fetchers: Fetcher[] = [
  getEvmLpFetcher(
    `instadapp-lite-lp`,
    NetworkId.ethereum,
    liteConfigs.map((lc) => lc.address)
  ),
];
