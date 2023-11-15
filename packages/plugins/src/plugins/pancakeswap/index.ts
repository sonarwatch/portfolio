import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import aptosJob from './aptosLpJob';
import {
  factoryV2Bnb,
  masterChefV2Bnb,
  masterChefV2Ethereum,
  networksConfigs,
  pancakeswapPlatform,
  platformId,
  stakersBnb,
  stakersEthereum,
  theGraphUrlEthV2,
} from './constants';
import getPoolsJob from '../uniswap-v2/getPoolsJob';
import getPositionsV2Fetcher from '../uniswap-v2/getPositionsV2Fetcher';
import getStakersBalancesFetcher from './getStakersBalancesFetcher';
import stakerCakeFetcher from './stakerCakeFetcher';
import getFarmsV2Fetcher from './getFarmsV2Fetcher';
import { getPositionsV3Fetcher } from '../uniswap/getPositionsV3Fetcher';

export const platforms: Platform[] = [pancakeswapPlatform];
export const jobs: Job[] = [
  // Aptos
  aptosJob,
  // Ethereum
  {
    id: `${platformId}-v2-${NetworkId.ethereum}`,
    executor: getPoolsJob(theGraphUrlEthV2, platformId, NetworkId.ethereum),
  },
  // BNB
  {
    id: `${platformId}-v2-${NetworkId.bnb}`,
    executor: getPoolsJob(factoryV2Bnb, platformId, NetworkId.bnb),
  },
];
export const fetchers: Fetcher[] = [
  // V3 (all EVMs)
  ...networksConfigs.map((config) => getPositionsV3Fetcher(config, platformId)),
  // V2 Ethereum
  {
    id: `${platformId}-poolsV2-${NetworkId.ethereum}`,
    executor: getPositionsV2Fetcher(platformId, NetworkId.ethereum),
    networkId: NetworkId.ethereum,
  },
  {
    id: `${platformId}-farmsV2-${NetworkId.ethereum}`,
    executor: getFarmsV2Fetcher(masterChefV2Ethereum, NetworkId.ethereum),
    networkId: NetworkId.ethereum,
  },
  {
    id: `${platformId}-stakers-${NetworkId.ethereum}`,
    executor: getStakersBalancesFetcher(
      stakersEthereum,
      NetworkId.ethereum,
      platformId
    ),
    networkId: NetworkId.ethereum,
  },

  // V2 BNB
  {
    id: `${platformId}-poolsV2-${NetworkId.bnb}`,
    executor: getPositionsV2Fetcher(platformId, NetworkId.bnb),
    networkId: NetworkId.bnb,
  },
  // {
  //   id: `${platformId}-farmsV1-${NetworkId.bnb}`,
  //   executor: getFarmsV2FetcherGenerator(masterChefBnb, NetworkId.bnb),
  //   networkId: NetworkId.bnb,
  // },
  {
    id: `${platformId}-farmsV2-${NetworkId.bnb}`,
    executor: getFarmsV2Fetcher(masterChefV2Bnb, NetworkId.bnb),
    networkId: NetworkId.bnb,
  },
  {
    id: `${platformId}-stakers-${NetworkId.bnb}`,
    executor: getStakersBalancesFetcher(stakersBnb, NetworkId.bnb, platformId),
    networkId: NetworkId.bnb,
  },
  stakerCakeFetcher,
];
