import {
  NetworkIdType,
  TokenPriceSource,
  formatTokenAddress,
} from '@sonarwatch/portfolio-core';

type PoolUnderlying = {
  address: string;
  reserveAmount: number;
  decimals: number;
  weight: number;
  price?: number;
};

type LpDetails = {
  address: string;
  decimals: number;
  supply: number;
};

export function getLpUnderlyingTokenSource2() {}

export default function getLpTokenSource2(params: {
  networkId: NetworkIdType;
  sourceId: string;
  platformId: string;
  lpDetails: LpDetails;
  poolUnderlyings: PoolUnderlying[];
  elementName?: string;
  liquidityName?: string;
}): TokenPriceSource[] {
  const {
    poolUnderlyings,
    liquidityName,
    elementName,
    lpDetails,
    platformId,
    sourceId,
    networkId,
  } = params;

  const sources: TokenPriceSource[] = [];

  // LP Source
  if (poolUnderlyings.some((u) => u.price === undefined || u.price === 0))
    return sources;

  const price =
    poolUnderlyings.reduce(
      (acc, u) => acc + u.reserveAmount * (u.price as number),
      0
    ) / lpDetails.supply;
  const lpSource: TokenPriceSource = {
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
      price: u.price as number,
      amountPerLp: u.reserveAmount / lpDetails.supply,
      decimals: u.decimals,
    })),
    timestamp: Date.now(),
  };
  sources.push(lpSource);
  return sources;
}
