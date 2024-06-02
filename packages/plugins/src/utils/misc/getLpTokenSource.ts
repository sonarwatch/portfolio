import {
  NetworkIdType,
  TokenPriceSource,
  formatTokenAddress,
} from '@sonarwatch/portfolio-core';
import {
  PoolUnderlying,
  getLpUnderlyingTokenSource,
} from './getLpUnderlyingTokenSource';

export type LpDetails = {
  address: string;
  decimals: number;
  supply: number;
};

export type GetLpTokenSourceParams = {
  networkId: NetworkIdType;
  sourceId: string;
  platformId: string;
  lpDetails: LpDetails;
  poolUnderlyings: PoolUnderlying[];
  elementName?: string;
  liquidityName?: string;
  priceUnderlyings?: boolean;
};

export function getLpTokenSource(
  params: GetLpTokenSourceParams
): TokenPriceSource[] {
  const {
    poolUnderlyings,
    liquidityName,
    elementName,
    lpDetails,
    platformId,
    sourceId,
    networkId,
    priceUnderlyings,
  } = params;
  const sources: TokenPriceSource[] = [];

  // Verify underlyings weights
  let totalWeight = poolUnderlyings.reduce(
    (partialSum, p) => partialSum + (p.weight || 0),
    0
  );
  if (totalWeight === 0) totalWeight = 1;
  if (totalWeight > 1.01)
    throw new Error(`Weights are greater than 1: ${totalWeight}`);
  if (totalWeight < 0.99)
    throw new Error(`Weights are smaller than 1: ${totalWeight}`);

  // Price underlyings
  if (priceUnderlyings) {
    const uSources = getLpUnderlyingTokenSource({
      networkId,
      sourceId: lpDetails.address,
      poolUnderlyings,
    });
    sources.push(...uSources);
  }

  if (poolUnderlyings.some((u) => !u.tokenPrice)) return sources;
  // Price LP
  const price =
    poolUnderlyings.reduce(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (acc, u) => acc + u.reserveAmount * u.tokenPrice!.price,
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      price: u.tokenPrice!.price,
      amountPerLp: u.reserveAmount / lpDetails.supply,
      decimals: u.decimals,
    })),
    timestamp: Date.now(),
  };
  sources.push(lpSource);
  return sources;
}
