import {
  PortfolioLiquidity,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import tokenPriceToAssetTokens from '../misc/tokenPriceToAssetTokens';

export function getLiquidity(
  balance: bigint,
  tokenPrice: TokenPrice
): PortfolioLiquidity {
  const amount = new BigNumber(balance.toString())
    .div(10 ** tokenPrice.decimals)
    .toNumber();

  const assets = tokenPriceToAssetTokens(
    tokenPrice.address,
    amount,
    tokenPrice.networkId,
    tokenPrice
  );
  const value = getUsdValueSum(assets.map((a) => a.value));
  return {
    assets,
    assetsValue: value,
    rewardAssets: [],
    rewardAssetsValue: null,
    value,
    yields: [],
  };
}
