import { NetworkId } from '@sonarwatch/portfolio-core';
import DSA from 'dsa-connect';
import Web3 from 'web3-v1';
import { ChainId } from '@aave/contract-helpers';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import lendingPoolsJob from './lendingPoolsJob';
import getLendingFetcherExecutor from './lendingFetcherExecutorGenerator';
import { getUrlEndpoint } from '../../utils/clients/constants';
import { platformId } from './constants';

export const jobs: Job[] = [lendingPoolsJob];
export const fetchers: Fetcher[] = [
  {
    id: `${platformId}-${NetworkId.ethereum}-lending`,
    networkId: NetworkId.ethereum,
    executor: getLendingFetcherExecutor(
      NetworkId.ethereum,
      new DSA(
        {
          web3: new Web3(
            new Web3.providers.HttpProvider(getUrlEndpoint(NetworkId.ethereum))
          ),
        },
        ChainId.mainnet
      )
    ),
  },
  {
    id: `${platformId}-${NetworkId.polygon}-lending`,
    networkId: NetworkId.polygon,
    executor: getLendingFetcherExecutor(
      NetworkId.polygon,
      new DSA(
        {
          web3: new Web3(
            new Web3.providers.HttpProvider(getUrlEndpoint(NetworkId.polygon))
          ),
        },
        ChainId.polygon
      )
    ),
  },
  {
    id: `${platformId}-${NetworkId.avalanche}-lending`,
    networkId: NetworkId.avalanche,
    executor: getLendingFetcherExecutor(
      NetworkId.avalanche,
      new DSA(
        {
          web3: new Web3(
            new Web3.providers.HttpProvider(getUrlEndpoint(NetworkId.avalanche))
          ),
        },
        ChainId.avalanche
      )
    ),
  },
];
