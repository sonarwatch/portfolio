import { PortfolioAsset, PortfolioAssetType } from '../Portfolio';
import { TokenInfo } from '../TokenList';

export function getImageFromAsset(
  asset: PortfolioAsset,
  tokenInfo?: TokenInfo
): string | undefined | null {
  switch (asset.type) {
    case PortfolioAssetType.collectible:
      return asset.imageUri || asset.data.imageUri;
    case PortfolioAssetType.token:
      return asset.imageUri || tokenInfo?.logoURI;
    case PortfolioAssetType.generic:
      return asset.imageUri;
    default:
      return null;
  }
}
