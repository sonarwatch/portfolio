import { PortfolioAsset, PortfolioAssetType } from '../Portfolio';
import { TokenInfo } from '../TokenList';

export function getImageFromAsset(
  asset: PortfolioAsset,
  tokenInfo?: TokenInfo
): string | undefined | null {
  switch (asset.type) {
    case PortfolioAssetType.collectible:
      return asset.data.imageUri;
    case PortfolioAssetType.token:
      return tokenInfo?.logoURI;
    case PortfolioAssetType.generic:
      return null;
    default:
      return null;
  }
}
