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
  const fPrice: UsdValue = tokenPrice?.price || price || null;
  return {
    type: PortfolioAssetType.token,
    networkId,
    value: fPrice ? fPrice * amount : null,
    data: {
      address: formatTokenAddress(address, networkId),
      amount,
      price: fPrice,
    },
    attributes: attributes || {},
    link,
  };
}
