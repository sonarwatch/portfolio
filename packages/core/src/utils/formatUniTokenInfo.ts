import { NetworkIdType } from '../Network';
import { UniTokenInfo } from '../TokenList';
import { formatTokenAddress } from './formatTokenAddress';

export function formatUniTokenInfo(
  uToken: UniTokenInfo,
  networkId: NetworkIdType
): UniTokenInfo {
  return {
    ...uToken,
    address: formatTokenAddress(uToken.address, networkId),
  };
}
