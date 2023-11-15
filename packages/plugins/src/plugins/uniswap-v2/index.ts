import { NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { theGraphUrl } from './constants';
import uniPoolV2JobExecutorGenerator from './poolJobExecutorGenerator';
import { platformId as uniswapPlatform } from '../uniswap/constants';
import getUniV2PoolsBalancesFetcherGenerator from './getUniV2PoolsBalancesFetcherGenerator';

export const jobs: Job[] = [
  {
    id: `${uniswapPlatform}-v2`,
    executor: uniPoolV2JobExecutorGenerator(
      theGraphUrl,
      uniswapPlatform,
      NetworkId.ethereum
    ),
  },
];
export const fetchers: Fetcher[] = [
  {
    id: `${uniswapPlatform}-v2`,
    executor: getUniV2PoolsBalancesFetcherGenerator(
      uniswapPlatform,
      NetworkId.ethereum
    ),
    networkId: NetworkId.ethereum,
  },
];
