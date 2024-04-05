import {
  NetworkIdType,
  TokenPrice,
  TokenPriceSource,
  coingeckoSourceId,
  formatTokenAddress,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import getSourceWeight from './getSourceWeight';
import { walletTokensPlatform } from '../../plugins/tokens/constants';
import { defaultAcceptedPairs } from './getLpUnderlyingTokenSource';

export type PoolData = {
  id: string;
  supply: BigNumber;
  lpDecimals: number;
  reserveTokenX: BigNumber;
  reserveTokenY: BigNumber;
  mintTokenX: string;
  decimalX?: number;
  mintTokenY: string;
  decimalY?: number;
};

type PoolUnderlyingRaw = {
  address: string;
  reserveAmountRaw: BigNumber;
  decimals: number;
  tokenPrice: TokenPrice | undefined;
  weight: number;
};

type KnownPoolUnderlyingRaw = PoolUnderlyingRaw & {
  tokenPrice: TokenPrice;
};

/**
 * @deprecated
 * This function has been deprecated. Use the new getLpUnderlyingTokenSource instead.
 */
export default function getLpUnderlyingTokenSourceOld(
  sourceId: string,
  networkId: NetworkIdType,
  poolUnderlyingsA: PoolUnderlyingRaw,
  poolUnderlyingsB: PoolUnderlyingRaw,
  minTvl = 2000,
  acceptedPairs = defaultAcceptedPairs
): TokenPriceSource | null {
  if (poolUnderlyingsA.weight + poolUnderlyingsB.weight > 1.02)
    throw new Error('Weights greater than 1');
  if (poolUnderlyingsA.weight + poolUnderlyingsB.weight < 0.98)
    throw new Error('Weights are less than 1');

  if (!poolUnderlyingsA.tokenPrice && !poolUnderlyingsB.tokenPrice) return null;
  if (poolUnderlyingsA.tokenPrice?.price === 0) return null;
  if (poolUnderlyingsB.tokenPrice?.price === 0) return null;

  const isAcceptedTokenA =
    acceptedPairs
      .get(networkId)
      ?.includes(formatTokenAddress(poolUnderlyingsA.address, networkId)) ??
    false;
  const isAcceptedTokenB =
    acceptedPairs
      .get(networkId)
      ?.includes(formatTokenAddress(poolUnderlyingsB.address, networkId)) ??
    false;
  if (isAcceptedTokenA && isAcceptedTokenB) return null;

  let knownUnderlaying: KnownPoolUnderlyingRaw | undefined;
  let unknownUnderlaying: PoolUnderlyingRaw | undefined;
  if (poolUnderlyingsA.tokenPrice && isAcceptedTokenA) {
    knownUnderlaying = poolUnderlyingsA as KnownPoolUnderlyingRaw;
    unknownUnderlaying = poolUnderlyingsB as KnownPoolUnderlyingRaw;
  } else if (poolUnderlyingsB.tokenPrice && isAcceptedTokenB) {
    knownUnderlaying = poolUnderlyingsB as KnownPoolUnderlyingRaw;
    unknownUnderlaying = poolUnderlyingsA as KnownPoolUnderlyingRaw;
  }
  if (!knownUnderlaying || !unknownUnderlaying) return null;
  if (
    unknownUnderlaying.tokenPrice &&
    unknownUnderlaying.tokenPrice.sources.some(
      (source) => source.id === coingeckoSourceId
    )
  ) {
    return null;
  }

  const knownReserveAmount = knownUnderlaying.reserveAmountRaw
    .div(10 ** knownUnderlaying.decimals)
    .toNumber();
  const knownReserveValue =
    knownReserveAmount * knownUnderlaying.tokenPrice.price;
  if (minTvl > knownReserveValue) return null;

  const unknownReserveAmount = unknownUnderlaying.reserveAmountRaw
    .div(10 ** unknownUnderlaying.decimals)
    .toNumber();
  const price =
    ((unknownUnderlaying.weight / knownUnderlaying.weight) *
      knownReserveValue) /
    unknownReserveAmount;

  const source: TokenPriceSource = {
    id: sourceId,
    networkId,
    platformId: walletTokensPlatform.id,
    address: formatTokenAddress(unknownUnderlaying.address, networkId),
    decimals: unknownUnderlaying.decimals,
    price,
    weight: getSourceWeight(knownReserveValue),
    timestamp: Date.now(),
  };
  return source;
}
