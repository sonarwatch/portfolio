import {
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Position, Withdrawal } from '../types';
import { platformId } from '../constants';
import { getAddress } from 'viem';

import { getAssetsFromPositions } from '../helper';

/**
 * Returns the yield positions for a given owner
 * @param owner - The address of the owner
 * @param cache - The cache instance
 * @returns The yield positions
 */
export const getWithdrawals = async (owner: string, cache: Cache) => {
  const withdrawals = await cache.getItem<Withdrawal[]>(
    'eigenlayer-withdrawals',
    {
      prefix: platformId,
      networkId: NetworkId.ethereum,
    }
  );

  const strategies = await cache.getItem<Position[]>('eigenlayer-strategies', {
    prefix: platformId,
    networkId: NetworkId.ethereum,
  });

  const userWithdrawals = withdrawals?.filter(
    (withdrawal) =>
      getAddress(withdrawal.withdrawerAddress) === getAddress(owner)
  );

  const shares = userWithdrawals?.flatMap((withdrawal) => withdrawal.shares);

  if (!shares || shares.length === 0) return [];

  // Build the positions
  const positions: Position[] = shares.map((share) => ({
    strategyAddress: share.strategyAddress,
    amount: share.shares,
    underlyingToken: strategies?.find(
      (strategy) =>
        getAddress(strategy.strategyAddress) ===
        getAddress(share.strategyAddress)
    )?.underlyingToken,
    decimals: strategies?.find(
      (strategy) =>
        getAddress(strategy.strategyAddress) ===
        getAddress(share.strategyAddress)
    )?.decimals,
  }));

  // Get the assets from the positions
  const assets = await getAssetsFromPositions(positions, cache);

  const totalValue = assets.reduce(
    (acc, asset) => acc + (asset?.value || 0),
    0
  );

  const elements: PortfolioElement = {
    networkId: NetworkId.ethereum,
    platformId,
    name: 'Completable Withdrawals',
    label: 'Deposit',
    type: PortfolioElementType.multiple,
    value: totalValue,
    data: {
      assets: assets,
    },
  };

  return [elements];
};
