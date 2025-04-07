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
  /*
    Some tokens, like the Morpho legacy token, are not tradable and therefore have a price of 0.
    The original Sonarwatch implementation treated all falsy values (including 0) as missing prices.
    This caused it to incorrectly ignore valid prices of 0. 

    This code has been updated to correctly treat 0 as a valid price,
    while still ignoring prices that are null or undefined.
  */
  let fPrice: UsdValue = null;
  let value: UsdValue = null;
  if (tokenPrice?.price != null) {
    fPrice = tokenPrice.price;
    value = fPrice * amount;
  } else if (price != null) {
    fPrice = price;
    value = fPrice * amount;
  }
  return {
    type: PortfolioAssetType.token,
    networkId,
    value,
    data: {
      address: formatTokenAddress(address, networkId),
      amount,
      price: fPrice,
    },
    attributes: attributes || {},
    link,
  };
}
