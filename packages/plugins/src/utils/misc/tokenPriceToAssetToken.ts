import {
  NetworkIdType,
  PortfolioAssetToken,
  PortfolioAssetType,
  TokenPrice,
  TokenPriceUnderlying,
} from '@sonarwatch/portfolio-core';

export function tokenPriceToAssetToken(
  address: string,
  amount: number,
  networkId: NetworkIdType,
  tokenPrice?: TokenPrice | TokenPriceUnderlying | null
): PortfolioAssetToken {
  return {
    type: PortfolioAssetType.token,
    networkId,
    value: tokenPrice ? tokenPrice.price * amount : null,
    data: {
      address,
      amount,
      price: tokenPrice ? tokenPrice.price : null,
    },
  };
}
