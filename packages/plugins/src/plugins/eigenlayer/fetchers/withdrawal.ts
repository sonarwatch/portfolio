import { Address, getAddress } from 'viem';
import { Cache } from '../../../Cache';
import { Position, Withdrawal } from '../types';
import { cacheKey, chain, platformId } from '../constants';

import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';

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

  const elementRegistry = new ElementRegistry(chain, platformId);

  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
    name: 'Completable Withdrawals',
    tags: ['Withdrawal'],
  });

  shares.forEach((share) => {
    element.addAsset({
      address: strategies?.find(
        (strategy) => strategy.strategyAddress === share.strategyAddress
      )?.underlyingToken as Address,
      amount: share.shares,
    });
  });

  return elementRegistry.getElements(cache);
};
