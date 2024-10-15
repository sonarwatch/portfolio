import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import aptosJob from './aptosLpJob';
import {
  // factoryV2Bnb,
  masterChefV2Bnb,
  masterChefV2Ethereum,
  networksConfigs,
  platform,
  platformId,
  stakersBnb,
  stakersEthereum,
  // theGraphUrlEthV2,
} from './constants';
// import getPoolsJob from '../uniswap-v2/getPoolsJob';
import getPositionsV2Fetcher from '../uniswap-v2/getPositionsV2Fetcher';
import getStakersBalancesFetcher from './getStakersBalancesFetcher';
import stakerCakeFetcher from './stakerCakeFetcher';
import { getUniV3PositionsFetcher } from '../uniswap/getUniV3PositionsFetcher';
import getFarmsV2Fetcher from './getFarmsV2Fetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [
  // Aptos
  aptosJob,
  // Ethereum
  // getPoolsJob(NetworkId.ethereum, platformId, 'V2', theGraphUrlEthV2),
  // BNB
  // getPoolsJob(NetworkId.bnb, platformId, 'V1', factoryV2Bnb),
];
export const fetchers: Fetcher[] = [
  // V3 (all EVMs)
  ...networksConfigs.map((config) =>
    getUniV3PositionsFetcher(config, platformId, 'V3')
  ),
  // V2 Ethereum
  getPositionsV2Fetcher(NetworkId.ethereum, platformId, 'V2'),
  getFarmsV2Fetcher(NetworkId.ethereum, 'V2', masterChefV2Ethereum),
  getStakersBalancesFetcher(NetworkId.ethereum, platformId, stakersEthereum),

  // V2 BNB
  getPositionsV2Fetcher(NetworkId.bnb, platformId, 'V2'),
  // {
  //   id: `${platformId}-farmsV1-${NetworkId.bnb}`,
  //   executor: getFarmsV2FetcherGenerator(masterChefBnb, NetworkId.bnb),
  //   networkId: NetworkId.bnb,
  // },
  getFarmsV2Fetcher(NetworkId.bnb, 'V2', masterChefV2Bnb),
  getStakersBalancesFetcher(NetworkId.bnb, platformId, stakersBnb),
  stakerCakeFetcher,
];
