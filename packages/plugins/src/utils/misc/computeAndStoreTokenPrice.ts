import {
  NetworkIdType,
  TokenPrice,
  TokenPriceSource,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import getSourceWeight from './getSourceWeight';
import { walletTokensPlatform } from '../../platforms';
import { getDecimalsForToken } from './getDecimalsForToken';

export type TokenInfo = {
  mint: string;
  tokenPrice: TokenPrice | undefined;
  rawReserve: BigNumber;
};

export type PartialTokenUnderlying = {
  networkId: NetworkIdType;
  address: string;
  decimals: number;
  price: number;
};

export default async function checkComputeAndStoreTokensPrices(
  cache: Cache,
  source: string,
  networkId: NetworkIdType,
  tokenX: TokenInfo,
  tokenY: TokenInfo
): Promise<
  | {
      partialTokenUnderlyingX: PartialTokenUnderlying;
      partialTokenUnderlyingY: PartialTokenUnderlying;
    }
  | undefined
> {
  let partialTokenUnderlyingX;
  let partialTokenUnderlyingY;
  if (!tokenX.tokenPrice || !tokenY.tokenPrice) {
    const decimalsTokenX = tokenX.tokenPrice
      ? tokenX.tokenPrice.decimals
      : await getDecimalsForToken(tokenX.mint, networkId);

    const decimalsTokenY = tokenY.tokenPrice
      ? tokenY.tokenPrice.decimals
      : await getDecimalsForToken(tokenY.mint, networkId);
    if (decimalsTokenX === undefined || decimalsTokenY === undefined)
      return undefined;

    const tokenXReserve = tokenX.rawReserve.dividedBy(10 ** decimalsTokenX);
    const tokenYReserve = tokenY.rawReserve.dividedBy(10 ** decimalsTokenY);

    let priceX: number;
    let priceY: number;

    if (!tokenX.tokenPrice && tokenY.tokenPrice) {
      priceX = tokenY.rawReserve
        .multipliedBy(tokenY.tokenPrice.price)
        .dividedBy(tokenXReserve)
        .toNumber();
      priceY = tokenY.tokenPrice.price;
    } else if (!tokenY.tokenPrice && tokenX.tokenPrice) {
      priceX = tokenX.tokenPrice.price;
      priceY = tokenXReserve
        .multipliedBy(tokenX.tokenPrice.price)
        .dividedBy(tokenYReserve)
        .toNumber();
    } else {
      console.log(
        'computeAndStoreTokenPrice : Unable to compute token price, requires at least one token to compute a price.'
      );
      return undefined;
    }

    const weight = getSourceWeight(
      tokenXReserve.multipliedBy(priceX).multipliedBy(2)
    );

    const address = tokenX.tokenPrice ? tokenY.mint : tokenX.mint;
    const price = tokenX.tokenPrice ? priceY : priceX;
    const decimals = tokenX.tokenPrice ? decimalsTokenY : decimalsTokenX;
    if (decimals === undefined) return undefined;

    const tokenPriceSourceDest: TokenPriceSource = {
      id: source,
      weight,
      address,
      networkId,
      platformId: walletTokensPlatform.id,
      decimals,
      price,
      timestamp: Date.now(),
    };

    partialTokenUnderlyingX = {
      networkId,
      address: tokenX.mint,
      decimals: decimalsTokenX,
      price: priceX,
    };

    partialTokenUnderlyingY = {
      networkId,
      address: tokenY.mint,
      decimals: decimalsTokenY,
      price: priceY,
    };

    await cache.setTokenPriceSource(tokenPriceSourceDest);
  } else if (tokenX.tokenPrice && tokenY.tokenPrice) {
    partialTokenUnderlyingX = {
      networkId,
      address: tokenX.mint,
      decimals: tokenX.tokenPrice.decimals,
      price: tokenX.tokenPrice.price,
    };

    partialTokenUnderlyingY = {
      networkId,
      address: tokenY.mint,
      decimals: tokenY.tokenPrice.decimals,
      price: tokenY.tokenPrice.price,
    };
  } else {
    return undefined;
  }

  return { partialTokenUnderlyingX, partialTokenUnderlyingY };
}
