import { NetworkIdType, TokenPriceSource } from '@sonarwatch/portfolio-core';

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

export default function getLpTokenSource(
  networkId: NetworkIdType,
  sourceId: string,
  platformId: string,
  elementName: string | undefined,
  lpDetails: LpDetails,
  poolUnderlyings: PoolUnderlying[]
): TokenPriceSource {
  const price =
    poolUnderlyings.reduce((acc, u) => acc + u.reserveAmount * u.price, 0) /
    lpDetails.supply;

  return {
    networkId,
    platformId,
    id: sourceId,
    elementName,
    weight: 1,
    address: lpDetails.address,
    price,
    decimals: lpDetails.decimals,
    underlyings: poolUnderlyings.map((u) => ({
      networkId,
      address: u.address,
      price: u.price,
      amountPerLp: u.reserveAmount / lpDetails.supply,
      decimals: u.decimals,
    })),
    timestamp: Date.now(),
  };
}
