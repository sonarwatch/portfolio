import { NetworkIdType } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import checkComputeAndStoreTokensPrices from './computeAndStoreTokenPrice';

const minimumLiquidity = new BigNumber(5000);

export type PoolData = {
  id: string;
  supply: BigNumber;
  lpDecimals: number;
  reserveTokenX: BigNumber;
  reserveTokenY: BigNumber;
  mintTokenX: string;
  mintTokenY: string;
};
/**
 * Add a price source for a pool in the cache.
 * If one of the token composing the pool doesn't have a price in the cache, add a new token price source for it.
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

  const tokenPrices = await cache.getTokenPrices([tokenX, tokenY], networkId);
  const tokenPriceX = tokenPrices[0];
  const tokenPriceY = tokenPrices[1];

  const partialTokensPrices = await checkComputeAndStoreTokensPrices(
    cache,
    `${platformId}-${poolData.id}`,
    networkId,
    {
      mint: tokenX,
      tokenPrice: tokenPriceX,
      rawReserve: poolData.reserveTokenX,
    },
    {
      mint: tokenY,
      tokenPrice: tokenPriceY,
      rawReserve: poolData.reserveTokenY,
    }
  );
  if (!partialTokensPrices) return;

  const partialTokenX = partialTokensPrices.partialTokenUnderlyingX;
  const partialTokenY = partialTokensPrices.partialTokenUnderlyingY;

  const reserveAmountX = poolData.reserveTokenX.div(
    10 ** partialTokenX.decimals
  );
  const reserveAmountY = poolData.reserveTokenY.div(
    10 ** partialTokenY.decimals
  );

  const totalLiquidity = reserveAmountX
    .multipliedBy(partialTokenX.price)
    .plus(reserveAmountY.multipliedBy(partialTokenY.price));
  if (totalLiquidity.isLessThan(minimumLiquidity)) return;

  const reserveValueX = reserveAmountX.multipliedBy(partialTokenX.price);
  const reserveValueY = reserveAmountY.multipliedBy(partialTokenY.price);

  const lpPrice = reserveValueX
    .plus(reserveValueY)
    .dividedBy(poolData.supply.dividedBy(10 ** poolData.lpDecimals))
    .toNumber();

  const amountPerLpX = reserveAmountX.dividedBy(poolData.supply).toNumber();
  const amountPerLpY = reserveAmountY.dividedBy(poolData.supply).toNumber();

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
        amountPerLp: amountPerLpX,
      },
      {
        ...partialTokenY,
        amountPerLp: amountPerLpY,
      },
    ],
    timestamp: Date.now(),
  });
}
