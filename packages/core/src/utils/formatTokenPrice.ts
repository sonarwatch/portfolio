import { TokenPrice, TokenPriceUnderlying } from '../TokenPrice';
import { formatTokenAddress } from './formatTokenAddress';

function formatTokenPriceUnderlying(
  tpu: TokenPriceUnderlying
): TokenPriceUnderlying {
  return {
    ...tpu,
    address: formatTokenAddress(tpu.address, tpu.networkId),
  };
}

export function formatTokenPrice(tokenPrice: TokenPrice): TokenPrice {
  return {
    ...tokenPrice,
    address: formatTokenAddress(tokenPrice.address, tokenPrice.networkId),
    underlyings: tokenPrice.underlyings?.map((tpu) =>
      formatTokenPriceUnderlying(tpu)
    ),
  };
}
