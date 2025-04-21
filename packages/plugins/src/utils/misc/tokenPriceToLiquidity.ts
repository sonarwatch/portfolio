import {
  getUsdValueSum,
  NetworkIdType,
  PortfolioLiquidity,
  TokenPrice,
  TokenYield,
} from '@sonarwatch/portfolio-core';
import tokenPriceToAssetTokens from './tokenPriceToAssetTokens';

export default function tokenPriceToLiquidity(
  address: string,
  amount: number,
  networkId: NetworkIdType,
  tokenPrice: TokenPrice,
  tokenYield?: TokenYield
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
    yields: tokenYield ? [tokenYield.yield] : [],
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
