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
  reserve: BigNumber;
};

export default async function computeAndStoreTokenPrice(
  cache: Cache,
  source: string,
  networkId: NetworkIdType,
  tokenX: TokenInfo,
  tokenY: TokenInfo
): Promise<{ priceX: number; priceY: number } | undefined> {
  let priceX: number;
  let priceY: number;
  if (!tokenX.tokenPrice && tokenY.tokenPrice) {
    priceX = tokenY.reserve
      .multipliedBy(tokenY.tokenPrice.price)
      .dividedBy(tokenX.reserve)
      .toNumber();
    priceY = tokenY.tokenPrice.price;
  } else if (!tokenY.tokenPrice && tokenX.tokenPrice) {
    priceX = tokenX.tokenPrice.price;
    priceY = tokenX.reserve
      .multipliedBy(tokenX.tokenPrice.price)
      .dividedBy(tokenX.reserve)
      .toNumber();
  } else {
    console.log(
      'computeAndStoreTokenPrice : Unable to compute token price, requires at least one token to compute a price.'
    );
    return undefined;
  }

  const weight = getSourceWeight(
    tokenX.reserve.multipliedBy(priceX).multipliedBy(2)
  );

  const address = tokenX.tokenPrice ? tokenX.mint : tokenY.mint;
  const price = tokenX.tokenPrice ? priceX : priceY;
  const decimals = await getDecimalsForToken(address, networkId);
  if (!decimals) return undefined;

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

  await cache.setTokenPriceSource(tokenPriceSourceDest);

  return { priceX, priceY };
}
