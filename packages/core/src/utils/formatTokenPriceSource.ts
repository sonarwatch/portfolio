import { TokenPriceSource } from '../TokenPrice';
import { formatTokenAddress } from './formatTokenAddress';
import { formatTokenPriceUnderlying } from './formatTokenPriceUnderlying';

export function formatTokenPriceSource(
  source: TokenPriceSource
): TokenPriceSource {
  return {
    ...source,
    address: formatTokenAddress(source.address, source.networkId),
    underlyings: source.underlyings?.map((tpu) =>
      formatTokenPriceUnderlying(tpu)
    ),
  };
}
