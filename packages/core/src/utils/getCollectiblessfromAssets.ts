import {
  PortfolioAsset,
  PortfolioAssetCollectible,
  PortfolioAssetType,
} from '../Portfolio';

export function getCollectiblessfromAssets(
  assets: PortfolioAsset[]
): PortfolioAssetCollectible[] {
  return assets.filter(
    (asset) => asset.type === PortfolioAssetType.collectible
  ) as PortfolioAssetCollectible[];
}
