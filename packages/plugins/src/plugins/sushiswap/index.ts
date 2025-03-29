import { NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
// import getPoolsJob from '../uniswap-v2/getPoolsJob';
import getPositionsV2Fetcher from '../uniswap-v2/getPositionsV2Fetcher';
import aptosPoolsJob from './aptos/poolsJob';
import { platformId } from './constants';

export const jobs: Job[] = [
  aptosPoolsJob,
  // getPoolsJob(NetworkId.ethereum, platformId, 'v2', ethereumTheGraphV2),
  // getPoolsJob(NetworkId.polygon, platformId, 'v2', polygonTheGraphV2),
  // getPoolsJob(NetworkId.avalanche, platformId, 'v2', avalancheTheGraphV2),
  // getPoolsJob(NetworkId.bnb, platformId, 'v2', bnbTheGraphV2),
];
export const fetchers: Fetcher[] = [
  getPositionsV2Fetcher(NetworkId.ethereum, platformId, 'v2'),
  getPositionsV2Fetcher(NetworkId.polygon, platformId, 'v2'),
  getPositionsV2Fetcher(NetworkId.avalanche, platformId, 'v2'),
  // getPositionsV2Fetcher(NetworkId.bnb, platformId, 'v2'),
  // getUniV3PositionsFetcher(
  //   {
  //     networkId: NetworkId.ethereum,
  //     factory: '0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F',
  //     positionManager: '0x2214A42d8e2A1d20635c2cb0664422c528B6A432',
  //   },
  //   platformId,
  //   'v3'
  // ),
];
