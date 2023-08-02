import { NetworkIdType } from '../Network';
import { TokenInfo, UniTokenInfo } from '../TokenList';
import { formatTokenAddress } from './formatTokenAddress';

export function uniswapTokenInfoToTokenInfo(
  uTokenInfo: UniTokenInfo,
  networkId: NetworkIdType
): TokenInfo {
  return {
    networkId,
    address: formatTokenAddress(uTokenInfo.address, networkId),
    decimals: uTokenInfo.decimals,
    chainId: uTokenInfo.chainId,
    name: uTokenInfo.name,
    symbol: uTokenInfo.symbol,
    extensions: uTokenInfo.extensions,
    logoURI: uTokenInfo.logoURI,
    tags: uTokenInfo.tags,
  };
}
