import {
  NetworkIdType,
  PortfolioAssetToken,
  PortfolioAssetType,
  TokenPrice,
  TokenPriceUnderlying,
  formatTokenAddress,
} from '@sonarwatch/portfolio-core';

export default function tokenPriceToAssetToken(
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
      address: formatTokenAddress(address, networkId),
      amount,
      price: tokenPrice ? tokenPrice.price : null,
    },
  };
}
