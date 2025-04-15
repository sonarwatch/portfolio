import {
  getUsdValueSum,
  NetworkIdType,
  PortfolioLiquidity,
  TokenPrice,
  TokenYield,
  Yield,
} from '@sonarwatch/portfolio-core';
import tokenPriceToAssetTokens from './tokenPriceToAssetTokens';

export default function tokenPriceToLiquidity(
  address: string,
  amount: number,
  networkId: NetworkIdType,
  tokenPrice: TokenPrice,
  tokenYield?: TokenYield | undefined
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
    yields: [tokenYield?.yield].filter((y) => y !== undefined) as Yield[],
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
