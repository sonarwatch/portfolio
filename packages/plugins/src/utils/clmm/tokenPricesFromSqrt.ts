import { NetworkIdType, TokenPriceSource } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import Decimal from 'decimal.js';
import { Cache } from '../../Cache';
import { getDecimalsForToken } from '../misc/getDecimalsForToken';
import { walletTokensPlatform } from '../../plugins/tokens/constants';
import getSourceWeight from '../misc/getSourceWeight';
import { tokensToRelyOnByNetwork } from '../misc/checkComputeAndStoreTokensPrices';
import { minimumLiquidity } from '../misc/computeAndStoreLpPrice';

export default async function storeTokenPricesFromSqrt(
  cache: Cache,
  networkId: NetworkIdType,
  source: string,
  reserveX: BigNumber,
  reserveY: BigNumber,
  sqrtPrice: BigNumber,
  mintX: string,
  mintY: string,
  tempDecimalsX?: number,
  tempDecimalsY?: number
) {
  const tokensToRelyOn = tokensToRelyOnByNetwork.get(networkId);

  if (!tokensToRelyOn) return undefined;

  if (!tokensToRelyOn.includes(mintX) && !tokensToRelyOn.includes(mintY))
    return undefined;
  const tokensPrices = await cache.getTokenPrices([mintX, mintY], networkId);
  const tokenPriceX = tokensPrices[0];
  const tokenPriceY = tokensPrices[1];
  if (!tokenPriceX && !tokenPriceY) return undefined;
  if (tokenPriceX && tokenPriceY) return [tokenPriceX.price, tokenPriceY.price];

  const decimalsX =
    tempDecimalsX || (await getDecimalsForToken(cache, mintX, networkId));
  const decimalsY =
    tempDecimalsY || (await getDecimalsForToken(cache, mintY, networkId));
  if (!decimalsX || !decimalsY) return undefined;

  const xToYPrice = sqrtPriceX64ToPrice(sqrtPrice, decimalsX, decimalsY);

  if (tokenPriceX) {
    const price =
      tokenPriceX.price * new Decimal(1).dividedBy(xToYPrice).toNumber();
    const weight = getSourceWeight(
      reserveX
        .multipliedBy(tokenPriceX.price)
        .plus(reserveY.multipliedBy(price))
    );
    const tvl = reserveX
      .multipliedBy(tokenPriceX.price)
      .plus(reserveY.multipliedBy(price));
    if (tvl.isLessThan(minimumLiquidity)) return undefined;
    const tokenPriceSource: TokenPriceSource = {
      id: source,
      weight,
      address: mintY,
      networkId,
      platformId: walletTokensPlatform.id,
      decimals: decimalsY,
      price,
      timestamp: Date.now(),
    };
    await cache.setTokenPriceSource(tokenPriceSource);
    return [tokenPriceX.price, price];
  }
  if (tokenPriceY) {
    const price = tokenPriceY.price * xToYPrice.toNumber();
    const weight = getSourceWeight(
      reserveY
        .multipliedBy(tokenPriceY.price)
        .plus(reserveX.multipliedBy(price))
    );
    const tvl = reserveX
      .multipliedBy(price)
      .plus(reserveY.multipliedBy(tokenPriceY.price));
    if (tvl.isLessThan(minimumLiquidity)) return undefined;
    const tokenPriceSource: TokenPriceSource = {
      id: source,
      weight,
      address: mintX,
      networkId,
      platformId: walletTokensPlatform.id,
      decimals: decimalsX,
      price,
      timestamp: Date.now(),
    };
    await cache.setTokenPriceSource(tokenPriceSource);
    return [price, tokenPriceY.price];
  }

  return undefined;
}

const fromX64Decimal = (num: Decimal) => num.times(Decimal.pow(2, -64));

export function sqrtPriceX64ToPrice(
  sqrtPriceX64: BigNumber,
  decimalsA: number,
  decimalsB: number
): Decimal {
  return fromX64Decimal(new Decimal(sqrtPriceX64.toString()))
    .pow(2)
    .mul(Decimal.pow(10, decimalsA - decimalsB));
}
