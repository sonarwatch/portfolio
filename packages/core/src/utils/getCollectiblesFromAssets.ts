import {
  PortfolioAsset,
  PortfolioAssetCollectible,
  PortfolioAssetType,
} from '../Portfolio';

export function getCollectiblesFromAssets(
  assets: PortfolioAsset[]
): PortfolioAssetCollectible[] {
  return assets.filter(
    (asset) => asset.type === PortfolioAssetType.collectible
  ) as PortfolioAssetCollectible[];
}
