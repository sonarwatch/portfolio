import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import {
  avalancheTheGraphV2,
  bnbTheGraphV2,
  ethereumTheGraphV2,
  sushiswapPlatform,
  polygonTheGraphV2,
} from './constants';
import getPoolsJob from '../uniswap-v2/getPoolsJob';
import getPositionsV2Fetcher from '../uniswap-v2/getPositionsV2Fetcher';
import aptosPoolsJob from './aptos/poolsJob';

export const platforms: Platform[] = [sushiswapPlatform];
export const jobs: Job[] = [
  aptosPoolsJob,
  getPoolsJob(
    NetworkId.ethereum,
    sushiswapPlatform.id,
    'v2',
    ethereumTheGraphV2
  ),
  getPoolsJob(NetworkId.polygon, sushiswapPlatform.id, 'v2', polygonTheGraphV2),
  getPoolsJob(
    NetworkId.avalanche,
    sushiswapPlatform.id,
    'v2',
    avalancheTheGraphV2
  ),
  getPoolsJob(NetworkId.bnb, sushiswapPlatform.id, 'v2', bnbTheGraphV2),
];
export const fetchers: Fetcher[] = [
  getPositionsV2Fetcher(NetworkId.ethereum, sushiswapPlatform.id, 'v2'),
  getPositionsV2Fetcher(NetworkId.polygon, sushiswapPlatform.id, 'v2'),
  getPositionsV2Fetcher(NetworkId.avalanche, sushiswapPlatform.id, 'v2'),
  // getPositionsV2Fetcher(NetworkId.bnb, platform.id, 'v2'),
  // getUniV3PositionsFetcher(
  //   {
  //     networkId: NetworkId.ethereum,
  //     factory: '0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F',
  //     positionManager: '0x2214A42d8e2A1d20635c2cb0664422c528B6A432',
  //   },
  //   platform.id,
  //   'v3'
  // ),
];
