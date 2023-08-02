import { NetworkIdType } from '../Network';
import { TokenInfo, UniTokenInfo } from '../TokenList';
import { formatTokenAddress } from './formatTokenAddress';

export function uniTokenInfoToTokenInfo(
  uTokenInfo: UniTokenInfo,
  networkId: NetworkIdType
): TokenInfo {
  return {
    networkId,
    address: formatTokenAddress(uTokenInfo.address, networkId),
    decimals: uTokenInfo.decimals,
    name: uTokenInfo.name,
    symbol: uTokenInfo.symbol,
    extensions: uTokenInfo.extensions,
    logoURI: uTokenInfo.logoURI,
    tags: uTokenInfo.tags,
  };
}
