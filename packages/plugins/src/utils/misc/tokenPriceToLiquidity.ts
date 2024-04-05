import {
  NetworkIdType,
  PortfolioLiquidity,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import tokenPriceToAssetTokens from './tokenPriceToAssetTokens';

export default function tokenPriceToLiquidity(
  address: string,
  amount: number,
  networkId: NetworkIdType,
  tokenPrice: TokenPrice
): PortfolioLiquidity {
  const assets = tokenPriceToAssetTokens(
    address,
    amount,
    networkId,
    tokenPrice
  );
  const liquidity: PortfolioLiquidity = {
    assets,
    assetsValue: getUsdValueSum(assets.map((a) => a.value)),
    rewardAssets: [],
    rewardAssetsValue: 0,
    value: getUsdValueSum(assets.map((a) => a.value)),
    yields: [],
    name: tokenPrice.liquidityName,
  };
  return liquidity;
}
