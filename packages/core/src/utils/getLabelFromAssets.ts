import { PortfolioAsset } from '../Portfolio';
import { TokenInfo } from '../TokenList';
import { getAddressFromAsset } from './getAddressFromAsset';
import { getLabelFromAsset } from './getLabelFromAsset';

export function getLabelFromAssets(
  assets: PortfolioAsset[],
  tokenInfos: Record<string, TokenInfo>
): string | undefined {
  const label = assets
    .map((a) => {
      const address = getAddressFromAsset(a);
      const tokenInfo = address ? tokenInfos[address] : undefined;
      return getLabelFromAsset(a, tokenInfo);
    })
    .join('-');
  return label !== '' ? label : undefined;
}
