import { NetworkIdType } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { getDecimalsForToken } from './getDecimalsForToken';
import computeAndStoreTokenPrice from './computeAndStoreTokenPrice';

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

  const decimalsTokenX = tokenPriceX
    ? tokenPriceX.decimals
    : await getDecimalsForToken(tokenX, networkId);

  const decimalsTokenY = tokenPriceY
    ? tokenPriceY.decimals
    : await getDecimalsForToken(tokenY, networkId);

  if (!decimalsTokenX || !decimalsTokenY) return;

  const reserveAmountX = poolData.reserveTokenX.div(10 ** decimalsTokenX);
  const reserveAmountY = poolData.reserveTokenY.div(10 ** decimalsTokenY);

  const tokensPrices = await computeAndStoreTokenPrice(
    cache,
    `${platformId}-${poolData.id}`,
    networkId,
    { mint: tokenX, tokenPrice: tokenPriceX, reserve: reserveAmountX },
    { mint: tokenY, tokenPrice: tokenPriceY, reserve: reserveAmountY }
  );
  if (!tokensPrices) return;

  const priceTokenX = tokensPrices.priceX;
  const priceTokenY = tokensPrices.priceY;

  const totalLiquidity = reserveAmountX
    .multipliedBy(priceTokenX)
    .plus(reserveAmountY.multipliedBy(priceTokenY));
  if (totalLiquidity.isLessThan(minimumLiquidity)) return;

  const reserveValueX = reserveAmountX.multipliedBy(priceTokenX);
  const reserveValueY = reserveAmountY.multipliedBy(priceTokenY);
  const lpPrice = reserveValueX
    .plus(reserveValueY)
    .dividedBy(poolData.supply)
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
        networkId,
        address: tokenX,
        decimals: decimalsTokenX,
        price: priceTokenX,
        amountPerLp: amountPerLpX,
      },
      {
        networkId,
        address: tokenY,
        decimals: decimalsTokenY,
        price: priceTokenY,
        amountPerLp: amountPerLpY,
      },
    ],
    timestamp: Date.now(),
  });
}
