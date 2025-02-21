import {
  getUsdValueSum,
  NetworkIdType,
  PortfolioLiquidity,
  TokenPrice,
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
  return {
    assets,
    assetsValue: getUsdValueSum(assets.map((a) => a.value)),
    rewardAssets: [],
    rewardAssetsValue: 0,
    value: getUsdValueSum(assets.map((a) => a.value)),
    yields: [],
    name: tokenPrice.liquidityName,
    link: tokenPrice.link,
    sourceRefs: [
      {
        address,
        name: 'Pool',
      },
    ],
  };
}
