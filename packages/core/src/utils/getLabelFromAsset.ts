import { PortfolioAsset, PortfolioAssetType } from '../Portfolio';
import { TokenInfo } from '../TokenList';

export function getLabelFromAsset(
  asset: PortfolioAsset,
  tokenInfo?: TokenInfo
): string | undefined {
  switch (asset.type) {
    case PortfolioAssetType.collectible:
      return asset.name;
    case PortfolioAssetType.token:
      return asset.name || tokenInfo?.symbol || 'UNK';
    case PortfolioAssetType.generic:
      return asset.name;
    default:
      return undefined;
  }
}
