import { NetworkIdType } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import checkComputeAndStoreTokensPrices from './checkComputeAndStoreTokensPrices';

// This number is used to prevent very low liquidity pools to be added, as a safeguard against price manipulation.
export const minimumLiquidity = new BigNumber(5000);

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
/**
 * @deprecated
 * This function has been deprecated. Use the getLpTokenSource or getLpTokenSourceRaw instead.
 * Add a price source for a pool in the cache.
 * If one of the token composing the pool doesn't have a price and can be safely calculated, add a new token price.
 * WARNING : check tokensToRelyOnByNetwork for further details on how the new token price is calculated.
 *
 * @param cache The cache on which the LP price will be stored
 * @param tokenMintX The address/mint of the first token
 * @param tokenMintY The address/mint of the second token
 * @param poolData An object with informmations about the pool
 * @param networkId The network for which the LP price source is stored
 * @param platformId The platform from which the price is calculated
 *
 */
export default async function computeAndStoreLpPrice(
  cache: Cache,
  poolData: PoolData,
  networkId: NetworkIdType,
  platformId: string
) {
  const tokenX = poolData.mintTokenX;
  const tokenY = poolData.mintTokenY;
  const { decimalX } = poolData;
  const { decimalY } = poolData;
  const rawReserveX = poolData.reserveTokenX;
  const rawReserveY = poolData.reserveTokenY;

  const partialTokensPrices = await checkComputeAndStoreTokensPrices(
    cache,
    `${platformId}-${poolData.id}`,
    networkId,
    { mint: tokenX, decimal: decimalX, rawReserve: rawReserveX },
    { mint: tokenY, decimal: decimalY, rawReserve: rawReserveY }
  );
  if (!partialTokensPrices) return;

  const partialTokenX = partialTokensPrices.partialTokenUnderlyingX;
  const partialTokenY = partialTokensPrices.partialTokenUnderlyingY;

  const reserveAmountX = rawReserveX.div(10 ** partialTokenX.decimals);
  const reserveAmountY = rawReserveY.div(10 ** partialTokenY.decimals);

  const totalLiquidity = reserveAmountX
    .multipliedBy(partialTokenX.price)
    .plus(reserveAmountY.multipliedBy(partialTokenY.price));
  if (totalLiquidity.isLessThan(minimumLiquidity)) return;

  const reserveValueX = reserveAmountX.multipliedBy(partialTokenX.price);
  const reserveValueY = reserveAmountY.multipliedBy(partialTokenY.price);

  const poolSupply = poolData.supply.dividedBy(10 ** poolData.lpDecimals);

  const lpPrice = reserveValueX
    .plus(reserveValueY)
    .dividedBy(poolSupply)
    .toNumber();

  const amountXPerLp = reserveAmountX.dividedBy(poolSupply).toNumber();
  const amountYPerLp = reserveAmountY.dividedBy(poolSupply).toNumber();

  await cache.setTokenPriceSource({
    id: platformId,
    weight: 1,
    address: poolData.id,
    networkId,
    platformId,
    decimals: poolData.lpDecimals,
    price: lpPrice,
    underlyings: [
      {
        ...partialTokenX,
        amountPerLp: amountXPerLp,
      },
      {
        ...partialTokenY,
        amountPerLp: amountYPerLp,
      },
    ],
    timestamp: Date.now(),
  });
}
