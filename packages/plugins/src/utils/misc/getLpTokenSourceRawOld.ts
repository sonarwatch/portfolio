import { NetworkIdType, TokenPriceSource } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import getLpTokenSourceOld from './getLpTokenSourceOld';

/**
 * @deprecated
 */
export type PoolUnderlyingRaw = {
  address: string;
  reserveAmountRaw: BigNumber | string;
  price: number;
  decimals: number;
};

/**
 * @deprecated
 */
type LpDetailsRaw = {
  address: string;
  decimals: number;
  supplyRaw: BigNumber | string;
};

/**
 * @deprecated
 * This function has been deprecated. Use the new getLpTokenSourceRaw instead.
 */
export default function getLpTokenSourceRawOld(
  networkId: NetworkIdType,
  sourceId: string,
  platformId: string,
  lpDetailsRaw: LpDetailsRaw,
  poolUnderlyingsRaw: PoolUnderlyingRaw[],
  elementName?: string,
  liquidityName?: string
): TokenPriceSource {
  return getLpTokenSourceOld(
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
