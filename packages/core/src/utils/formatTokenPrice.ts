import { TokenPrice } from '../TokenPrice';
import { formatTokenAddress } from './formatTokenAddress';
import { formatTokenPriceUnderlying } from './formatTokenPriceUnderlying';

export function formatTokenPrice(tokenPrice: TokenPrice): TokenPrice {
  return {
    ...tokenPrice,
    address: formatTokenAddress(tokenPrice.address, tokenPrice.networkId),
    underlyings: tokenPrice.underlyings?.map((tpu) =>
      formatTokenPriceUnderlying(tpu)
    ),
  };
}
