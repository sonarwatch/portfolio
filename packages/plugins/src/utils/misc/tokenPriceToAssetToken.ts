import {
  NetworkIdType,
  PortfolioAssetAttributes,
  PortfolioAssetToken,
  PortfolioAssetType,
  TokenPrice,
  TokenPriceUnderlying,
  UsdValue,
  formatTokenAddress,
} from '@sonarwatch/portfolio-core';

export default function tokenPriceToAssetToken(
  address: string,
  amount: number,
  networkId: NetworkIdType,
  tokenPrice?: TokenPrice | TokenPriceUnderlying | null,
  price?: number,
  attributes?: PortfolioAssetAttributes,
  link?: string
): PortfolioAssetToken {
  // Handle prices of 0 different than undefined
  let fPrice: UsdValue = null;
  if (tokenPrice?.price !== undefined) {
    fPrice = tokenPrice.price;
  } else if (price !== undefined) {
    fPrice = price;
  }
  return {
    type: PortfolioAssetType.token,
    networkId,
    value: fPrice != null ? fPrice * amount : null,
    data: {
      address: formatTokenAddress(address, networkId),
      amount,
      price: fPrice,
    },
    attributes: attributes || {},
    link,
  };
}
