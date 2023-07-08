import {
  NetworkIdType,
  PortfolioAssetToken,
  TokenPrice,
} from '@sonarwatch/portfolio-core';
import { tokenPriceToAssetToken } from './tokenPriceToAssetToken';

export function tokenPriceToAssetTokens(
  address: string,
  amount: number,
  networkId: NetworkIdType,
  tokenPrice?: TokenPrice | null
): PortfolioAssetToken[] {
  if (!tokenPrice || !tokenPrice.underlyings)
    return [tokenPriceToAssetToken(address, amount, networkId, tokenPrice)];
  return tokenPrice.underlyings.map((tokenPriceUnderlying) =>
    tokenPriceToAssetToken(
      tokenPriceUnderlying.address,
      amount * tokenPriceUnderlying.amountPerLp,
      tokenPriceUnderlying.networkId,
      tokenPriceUnderlying
    )
  );
}
