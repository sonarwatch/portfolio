import {
  NetworkIdType,
  TokenPriceSource,
  formatTokenAddress,
} from '@sonarwatch/portfolio-core';

type PoolUnderlying = {
  address: string;
  reserveAmount: number;
  price: number;
  decimals: number;
};

type LpDetails = {
  address: string;
  decimals: number;
  supply: number;
};

/**
 * @deprecated
 * This function has been deprecated. Use the new getLpTokenSource instead.
 */
export default function getLpTokenSourceOld(
  networkId: NetworkIdType,
  sourceId: string,
  platformId: string,
  lpDetails: LpDetails,
  poolUnderlyings: PoolUnderlying[],
  elementName?: string,
  liquidityName?: string
): TokenPriceSource {
  const price =
    poolUnderlyings.reduce((acc, u) => acc + u.reserveAmount * u.price, 0) /
    lpDetails.supply;

  return {
    networkId,
    platformId,
    id: sourceId,
    elementName,
    liquidityName,
    weight: 1,
    address: formatTokenAddress(lpDetails.address, networkId),
    price,
    decimals: lpDetails.decimals,
    underlyings: poolUnderlyings.map((u) => ({
      networkId,
      address: formatTokenAddress(u.address, networkId),
      price: u.price,
      amountPerLp: u.reserveAmount / lpDetails.supply,
      decimals: u.decimals,
    })),
    timestamp: Date.now(),
  };
}
