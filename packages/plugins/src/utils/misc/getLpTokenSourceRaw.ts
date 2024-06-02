import {
  NetworkIdType,
  TokenPrice,
  TokenPriceSource,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { LpDetails, getLpTokenSource } from './getLpTokenSource';
import { PoolUnderlying } from './getLpUnderlyingTokenSource';

export type PoolUnderlyingRaw = {
  address: string;
  reserveAmountRaw: BigNumber | string;
  decimals: number;
  weight?: number;
  tokenPrice?: TokenPrice;
};

type LpDetailsRaw = {
  address: string;
  decimals: number;
  supplyRaw: BigNumber | string;
};

export type GetLpTokenSourceRawParams = {
  networkId: NetworkIdType;
  sourceId: string;
  platformId: string;
  lpDetails: LpDetailsRaw;
  poolUnderlyingsRaw: PoolUnderlyingRaw[];
  elementName?: string;
  liquidityName?: string;
  priceUnderlyings?: boolean;
};

export function getLpTokenSourceRaw(
  params: GetLpTokenSourceRawParams
): TokenPriceSource[] {
  const { lpDetails, poolUnderlyingsRaw } = params;
  const fLpDetails: LpDetails = {
    ...lpDetails,
    supply: new BigNumber(lpDetails.supplyRaw)
      .div(10 ** lpDetails.decimals)
      .toNumber(),
  };
  const fPoolUnderlyingsRaw: PoolUnderlying[] = poolUnderlyingsRaw.map(
    (pu) => ({
      ...pu,
      reserveAmount: new BigNumber(pu.reserveAmountRaw)
        .div(10 ** pu.decimals)
        .toNumber(),
    })
  );

  return getLpTokenSource({
    lpDetails: fLpDetails,
    networkId: params.networkId,
    platformId: params.platformId,
    sourceId: params.sourceId,
    poolUnderlyings: fPoolUnderlyingsRaw,
    elementName: params.elementName,
    liquidityName: params.liquidityName,
    priceUnderlyings: params.priceUnderlyings,
  });
}
