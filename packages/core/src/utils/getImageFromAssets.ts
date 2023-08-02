import { PortfolioAsset } from '../Portfolio';
import { TokenInfo } from '../TokenList';
import { getAddressFromAsset } from './getAddressFromAsset';
import { getImageFromAsset } from './getImageFromAsset';

export function getImageFromAssets(
  assets: PortfolioAsset[],
  tokenInfos: Record<string, TokenInfo>
): (string | undefined | null)[] {
  return assets.map((a) => {
    const address = getAddressFromAsset(a);
    const tokenInfo = address ? tokenInfos[address] : undefined;
    return getImageFromAsset(a, tokenInfo);
  });
}
