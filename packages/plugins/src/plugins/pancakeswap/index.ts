import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import aptosJob from './aptosLpJob';
import { pancakeswapPlatform, platformId, theGraphUrlEthV2 } from './constants';
import uniPoolV2JobExecutorGenerator from '../uniswap-v2/poolJobExecutorGenerator';
import getUniV2PoolsBalancesFetcherGenerator from '../uniswap-v2/getUniV2PoolsBalancesFetcherGenerator';

export const platforms: Platform[] = [pancakeswapPlatform];
export const jobs: Job[] = [
  aptosJob,
  {
    id: `${platformId}-v2-${NetworkId.ethereum}`,
    executor: uniPoolV2JobExecutorGenerator(
      theGraphUrlEthV2,
      platformId,
      NetworkId.ethereum
    ),
  },
  {
    id: `${platformId}-v2-${NetworkId.bnb}`,
    executor: uniPoolV2JobExecutorGenerator(
      '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
      platformId,
      NetworkId.bnb
    ),
  },
];
export const fetchers: Fetcher[] = [
  {
    id: `${platformId}-v2-${NetworkId.ethereum}`,
    executor: getUniV2PoolsBalancesFetcherGenerator(
      platformId,
      NetworkId.ethereum
    ),
    networkId: NetworkId.ethereum,
  },
  {
    id: `${platformId}-v2-${NetworkId.bnb}`,
    executor: getUniV2PoolsBalancesFetcherGenerator(platformId, NetworkId.bnb),
    networkId: NetworkId.bnb,
  },
];
