import { PortfolioAsset } from '../Portfolio';
import { TokenInfo } from '../TokenList';
import { solanaNativeAddress, solanaNativeWrappedAddress } from '../constants';
import { getAddressFromAsset } from './getAddressFromAsset';

export function getIsVerifiedFromAsset(
  asset: PortfolioAsset,
  tokenInfo?: TokenInfo
): boolean {
  const address = getAddressFromAsset(asset);
  if (address) {
    if ([solanaNativeAddress, solanaNativeWrappedAddress].includes(address))
      return true;
    if (tokenInfo?.tags) {
      return tokenInfo.tags.includes('verified');
    }
  }
  return false;
}
