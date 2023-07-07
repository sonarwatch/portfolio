import { TokenPriceUnderlying } from '../TokenPrice';
import { formatTokenAddress } from './formatTokenAddress';

export function formatTokenPriceUnderlying(
  tpu: TokenPriceUnderlying
): TokenPriceUnderlying {
  return {
    ...tpu,
    address: formatTokenAddress(tpu.address, tpu.networkId),
  };
}
