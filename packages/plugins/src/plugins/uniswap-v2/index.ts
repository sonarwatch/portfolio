import { NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { theGraphUrl } from './constants';
import getPoolsJob from './getPoolsJob';
import { platformId as uniswapPlatform } from '../uniswap/constants';
import getPositionsV2Fetcher from './getPositionsV2Fetcher';

export const jobs: Job[] = [
  {
    id: `${uniswapPlatform}-v2`,
    executor: getPoolsJob(theGraphUrl, uniswapPlatform, NetworkId.ethereum),
  },
];
export const fetchers: Fetcher[] = [
  {
    id: `${uniswapPlatform}-v2`,
    executor: getPositionsV2Fetcher(uniswapPlatform, NetworkId.ethereum),
    networkId: NetworkId.ethereum,
  },
];
