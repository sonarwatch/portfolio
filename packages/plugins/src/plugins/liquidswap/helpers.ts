import { NetworkIdType } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { coinDecimals } from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import { Cache } from '../../Cache';
import getSourceWeight from '../../utils/misc/getSourceWeight';
import { walletTokensPlatform } from '../../platforms';

export type PoolData = {
  id: string;
  supply: BigNumber;
  lpDecimals: number;
  reserveTokenX: BigNumber;
  reserveTokenY: BigNumber;
};
/**
 * Generate a source of price for a pool and add tokens price sources if their is none on the Cache.
 *
 * @param cache The cache on which the LP price will be stored
 * @param tokensMints The tokens composing the pool
 * @param poolData An object with informmations about the pool
 * @param networkId The network for which the LP price is stored
 * @param platformId The platform from which the price is calculated
 *
 */
export default async function addLpAndTokensPricesSource(
  cache: Cache,
  tokensMints: string[],
  poolData: PoolData,
  networkId: NetworkIdType,
  platformId: string
) {
  const tokenX = tokensMints[0];
  const tokenY = tokensMints[1];

  const tokenPrices = await cache.getTokenPrices([tokenX, tokenY], networkId);
  const tokenPriceX = tokenPrices[0];
  const tokenPriceY = tokenPrices[1];

  if (!tokenPriceX && !tokenPriceY) return;

  const decimalsX = tokenPriceX
    ? tokenPriceX.decimals
    : await getDecimalsForToken(tokenX, networkId);

  const decimalsY = tokenPriceY
    ? tokenPriceY.decimals
    : await getDecimalsForToken(tokenY, networkId);

  if (!decimalsX || !decimalsY) return;

  const reserveAmountX = poolData.reserveTokenX.div(10 ** decimalsX);
  const reserveAmountY = poolData.reserveTokenY.div(10 ** decimalsY);

  let priceX: number;
  let priceY: number;
  if (!tokenPriceX && tokenPriceY) {
    priceY = tokenPriceY.price;
    priceX = reserveAmountY
      .multipliedBy(priceY)
      .dividedBy(reserveAmountX)
      .toNumber();

    if (reserveAmountY.multipliedBy(priceY).multipliedBy(2).isLessThan(10000))
      return;

    await cache.setTokenPriceSource({
      id: `${platformId}-${poolData.id}`,
      weight: getSourceWeight(
        reserveAmountY.multipliedBy(priceY).multipliedBy(2)
      ),
      address: tokenX,
      networkId,
      platformId: walletTokensPlatform.id,
      decimals: decimalsX,
      price: priceX,
      timestamp: Date.now(),
    });
  } else if (!tokenPriceY && tokenPriceX) {
    priceX = tokenPriceX.price;
    priceY = reserveAmountX
      .multipliedBy(priceX)
      .dividedBy(reserveAmountY)
      .toNumber();
    if (reserveAmountX.multipliedBy(priceX).multipliedBy(2).isLessThan(10000))
      return;

    await cache.setTokenPriceSource({
      id: `${platformId}-${poolData.id}`,
      weight: getSourceWeight(
        reserveAmountX.multipliedBy(priceX).multipliedBy(2)
      ),
      address: tokenY,
      networkId,
      platformId: walletTokensPlatform.id,
      decimals: decimalsY,
      price: priceY,
      timestamp: Date.now(),
    });
  } else {
    return;
  }

  const reserveValueX = reserveAmountX.multipliedBy(priceX);
  const reserveValueY = reserveAmountY.multipliedBy(priceY);
  const price = reserveValueX
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
    price,
    underlyings: [
      {
        networkId,
        address: tokenX,
        decimals: decimalsX,
        price: priceX,
        amountPerLp: amountPerLpX,
      },
      {
        networkId,
        address: tokenY,
        decimals: decimalsY,
        price: priceY,
        amountPerLp: amountPerLpY,
      },
    ],
    timestamp: Date.now(),
  });
}

async function getDecimalsForToken(
  address: string,
  networkId: NetworkIdType
): Promise<number | undefined> {
  switch (networkId) {
    case 'aptos': {
      const client = getClientAptos();
      const viewRes = (await client.view({
        function: coinDecimals,
        type_arguments: [address],
        arguments: [],
      })) as number[];
      if (viewRes.length !== 1) return undefined;
      return viewRes[0];
    }
    default:
      break;
  }
  return 1;
}
