import { NetworkIdType, TokenPriceSource } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import getLpTokenSource from './getLpTokenSource';

export type PoolUnderlyingRaw = {
  address: string;
  reserveAmountRaw: BigNumber | string;
  price: number;
  decimals: number;
};

type LpDetailsRaw = {
  address: string;
  decimals: number;
  supplyRaw: BigNumber | string;
};

export default function getLpTokenSourceRaw(
  networkId: NetworkIdType,
  sourceId: string,
  platformId: string,
  lpDetailsRaw: LpDetailsRaw,
  poolUnderlyingsRaw: PoolUnderlyingRaw[],
  elementName?: string,
  liquidityName?: string
): TokenPriceSource {
  return getLpTokenSource(
    networkId,
    sourceId,
    platformId,
    {
      ...lpDetailsRaw,
      supply: new BigNumber(lpDetailsRaw.supplyRaw)
        .div(10 ** lpDetailsRaw.decimals)
        .toNumber(),
    },
    poolUnderlyingsRaw.map((u) => ({
      ...u,
      reserveAmount: new BigNumber(u.reserveAmountRaw)
        .div(10 ** u.decimals)
        .toNumber(),
    })),
    elementName,
    liquidityName
  );
}
