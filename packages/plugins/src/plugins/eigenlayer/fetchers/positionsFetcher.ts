import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';

import { getAddress } from 'viem';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import {
  bEigenTokenAddress,
  chain,
  eigenTokenAddress,
  platformId,
} from '../constants';

import { getYieldPositions } from './yield';
import { getDepositPositions } from './deposit';
import { getWithdrawals } from './withdrawal';

const executor: FetcherExecutor = async (
  owner: string,
  cache: Cache
): Promise<PortfolioElement[]> => {
  const eigenPrice = await cache.getTokenPrice(eigenTokenAddress, chain);

  // Map bEigen price with Eigen one
  await cache.setTokenPriceSource({
    id: 'bEigen',
    networkId: chain,
    platformId,
    address: bEigenTokenAddress,
    decimals: eigenPrice?.decimals || 18,
    price: eigenPrice?.price || 0,
    weight: 1,
    timestamp: eigenPrice?.timestamp || Date.now(),
  });

  const [yieldPositions, depositPositions, withdrawals] = await Promise.all([
    getYieldPositions(getAddress(owner), cache),
    getDepositPositions(getAddress(owner), cache),
    getWithdrawals(getAddress(owner), cache),
  ]);

  return [...yieldPositions, ...depositPositions, ...withdrawals];
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
