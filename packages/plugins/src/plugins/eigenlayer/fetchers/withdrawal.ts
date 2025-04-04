import {
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Address, getAddress } from 'viem';
import { Cache } from '../../../Cache';
import { Position, Withdrawal } from '../types';
import { cacheKey, chain, platformId } from '../constants';

import { getAssetsFromPositions } from '../helper';

/**
 * Returns the withdrawals for a given owner
 * @param owner - The address of the owner
 * @param cache - The cache instance
 * @returns The withdrawals
 */
export const getWithdrawals = async (owner: Address, cache: Cache) => {
  const withdrawals = await cache.getItem<Withdrawal[]>(cacheKey.withdrawals, {
    prefix: platformId,
    networkId: chain,
  });

  const strategies = await cache.getItem<Position[]>(cacheKey.strategies, {
    prefix: platformId,
    networkId: chain,
  });

  const userWithdrawals = withdrawals?.filter(
    (withdrawal) =>
      getAddress(withdrawal.withdrawerAddress) === getAddress(owner)
  );

  const shares = userWithdrawals?.flatMap((withdrawal) =>
    withdrawal.shares.map((share) => ({
      ...share,
      strategyAddress: getAddress(share.strategyAddress),
    }))
  );

  if (!shares || shares.length === 0) return [];

  // Build the positions
  const positions: Position[] = shares.map((share) => ({
    strategyAddress: share.strategyAddress,
    amount: share.shares,
    underlyingToken: strategies?.find(
      (strategy) => strategy.strategyAddress === share.strategyAddress
    )?.underlyingToken,
    decimals: strategies?.find(
      (strategy) => strategy.strategyAddress === share.strategyAddress
    )?.decimals,
  }));

  // Get the assets from the positions
  const assets = await getAssetsFromPositions(positions, cache);

  const totalValue = assets.reduce(
    (acc, asset) => acc + (asset?.value || 0),
    0
  );

  const element: PortfolioElement = {
    networkId: chain,
    platformId,
    name: 'Completable Withdrawals',
    label: 'Deposit',
    type: PortfolioElementType.multiple,
    value: totalValue,
    data: {
      assets,
    },
  };

  return [element];
};
