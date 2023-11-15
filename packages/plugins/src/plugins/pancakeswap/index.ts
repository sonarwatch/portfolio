import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import aptosJob from './aptosLpJob';
import {
  masterChefBnb,
  masterChefV2Bnb,
  masterChefV2Ethereum,
  pancakeswapPlatform,
  platformId,
  stakersBnb,
  stakersEthereum,
  theGraphUrlEthV2,
} from './constants';
import uniPoolV2JobExecutorGenerator from '../uniswap-v2/poolJobExecutorGenerator';
import getUniV2PoolsBalancesFetcherGenerator from '../uniswap-v2/getUniV2PoolsBalancesFetcherGenerator';
import getStakersBalancesFetcherGenerator from './getStakersBalancesFetcherGenerator';
import stakerCakeFetcher from './stakerCakeFetcher';
import getFarmsV2FetcherGenerator from './getFarmsV2FetcherGenerator';

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
  // Ethereum
  {
    id: `${platformId}-poolsV2-${NetworkId.ethereum}`,
    executor: getUniV2PoolsBalancesFetcherGenerator(
      platformId,
      NetworkId.ethereum
    ),
    networkId: NetworkId.ethereum,
  },
  {
    id: `${platformId}-farmsV2-${NetworkId.ethereum}`,
    executor: getFarmsV2FetcherGenerator(
      masterChefV2Ethereum,
      NetworkId.ethereum
    ),
    networkId: NetworkId.ethereum,
  },
  {
    id: `${platformId}-stakers-${NetworkId.ethereum}`,
    executor: getStakersBalancesFetcherGenerator(
      stakersEthereum,
      NetworkId.ethereum,
      platformId
    ),
    networkId: NetworkId.ethereum,
  },

  // BNB
  {
    id: `${platformId}-poolsV2-${NetworkId.bnb}`,
    executor: getUniV2PoolsBalancesFetcherGenerator(platformId, NetworkId.bnb),
    networkId: NetworkId.bnb,
  },
  {
    id: `${platformId}-farmsV1-${NetworkId.ethereum}`,
    executor: getFarmsV2FetcherGenerator(masterChefBnb, NetworkId.bnb),
    networkId: NetworkId.bnb,
  },
  {
    id: `${platformId}-farmsV2-${NetworkId.ethereum}`,
    executor: getFarmsV2FetcherGenerator(masterChefV2Bnb, NetworkId.bnb),
    networkId: NetworkId.bnb,
  },
  {
    id: `${platformId}-stakers-${NetworkId.bnb}`,
    executor: getStakersBalancesFetcherGenerator(
      stakersBnb,
      NetworkId.bnb,
      platformId
    ),
    networkId: NetworkId.bnb,
  },
  stakerCakeFetcher,
];
