import {
  NetworkIdType,
  PortfolioAssetAttributes,
  PortfolioAssetToken,
  PortfolioAssetType,
  TokenPrice,
  TokenPriceUnderlying,
  TokenYield,
  UsdValue,
  formatTokenAddress,
  fixUsdValue,
} from '@sonarwatch/portfolio-core';

export default function tokenPriceToAssetToken(
  address: string,
  amount: number,
  networkId: NetworkIdType,
  tokenPrice?: TokenPrice | TokenPriceUnderlying | null,
  price?: number,
  attributes?: PortfolioAssetAttributes,
  link?: string,
  tokenYield?: TokenYield | null
): PortfolioAssetToken {
  const fPrice: UsdValue = tokenPrice?.price || price || null;
  const fAmount = tokenPrice
    ? Number(amount.toFixed(tokenPrice.decimals))
    : amount;
  return {
    type: PortfolioAssetType.token,
    networkId,
    value: fixUsdValue(fPrice ? fPrice * amount : null),
    data: {
      address: formatTokenAddress(address, networkId),
      amount: fAmount,
      price: fPrice,
      yield: tokenYield?.yield,
    },
    attributes: attributes || {},
    link,
  };
}
