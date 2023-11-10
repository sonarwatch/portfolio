import { NetworkIdType, TokenPriceSource } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import getLpTokenSource from './getLpTokenSource';

type PoolUnderlyingRaw = {
  address: string;
  reserveAmountRaw: BigNumber;
  price: number;
  decimals: number;
};

type LpDetailsRaw = {
  address: string;
  decimals: number;
  supplyRaw: BigNumber;
};

export default function getLpTokenSourceRaw(
  networkId: NetworkIdType,
  sourceId: string,
  platformId: string,
  elementName: string,
  lpDetailsRaw: LpDetailsRaw,
  poolUnderlyingsRaw: PoolUnderlyingRaw[]
): TokenPriceSource {
  return getLpTokenSource(
    networkId,
    sourceId,
    platformId,
    elementName,
    {
      ...lpDetailsRaw,
      supply: lpDetailsRaw.supplyRaw
        .div(10 ** lpDetailsRaw.decimals)
        .toNumber(),
    },
    poolUnderlyingsRaw.map((u) => ({
      ...u,
      reserveAmount: u.reserveAmountRaw.div(10 ** u.decimals).toNumber(),
    }))
  );
}
