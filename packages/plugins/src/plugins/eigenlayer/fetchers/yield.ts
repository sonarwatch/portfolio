import { Address, getAddress } from 'viem';
import { getEvmClient } from '../../../utils/clients';
import { Cache } from '../../../Cache';
import { Position } from '../types';
import { cacheKey, chain, platformId } from '../constants';
import { abi } from '../abi';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';

/**
 * Returns the yield positions for a given owner
 * @param owner - The address of the owner
 * @param cache - The cache instance
 * @returns The yield positions
 */
export const getYieldPositions = async (owner: string, cache: Cache) => {
  const client = getEvmClient(chain);
  const strategies = await cache.getItem<Position[]>(cacheKey.strategies, {
    prefix: platformId,
    networkId: chain,
  });
  if (!strategies || strategies.length === 0) return [];

  // Fetch user shares on all strategies
  const [sharesResult] = await Promise.all([
    client.multicall({
      contracts: strategies.map((strategy) => ({
        address: getAddress(strategy.strategyAddress),
        abi: [abi.shares],
        functionName: abi.shares.name,
        args: [getAddress(owner)],
      })),
    }),
  ]);

  // Construct the strategies and underlying tokens with decimals
  const positions = strategies.map((strategy, i) => ({
    strategyAddress: getAddress(strategy.strategyAddress),
    underlyingToken: strategy.underlyingToken,
    shares: sharesResult[i].result,
    decimals: strategy.decimals,
  }));

  // Filter out positions with zero amounts
  const activePositionsShares = positions.filter(
    (position) =>
      position.shares && position.shares > 0 && position.underlyingToken
  );

  if (activePositionsShares.length === 0) return [];

  // Fetch the amount of underlying tokens from the shares
  const amounts = await client.multicall({
    contracts: activePositionsShares.map((position) => ({
      address: getAddress(position.strategyAddress),
      abi: [abi.sharesToUnderlying],
      functionName: abi.sharesToUnderlying.name,
      args: [position.shares],
    })),
  });

  const finalPositions = activePositionsShares.map((position, i) => ({
    ...position,
    amount: amounts[i].result as string,
  }));

  const elementRegistry = new ElementRegistry(chain, platformId);

  const element = elementRegistry.addElementMultiple({
    label: 'Yield',
    tags: ['Yield'],
  });

  finalPositions.forEach((position) => {
    element.addAsset({
      address: position.underlyingToken as Address,
      amount: position.amount,
    });
  });

  return elementRegistry.getElements(cache);
};
