import {
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
} from '../Portfolio';

export function getAssetsFromElement(
  element: PortfolioElement
): PortfolioAsset[] {
  switch (element.type) {
    case PortfolioElementType.multiple:
      return [...element.data.assets];
    case PortfolioElementType.liquidity:
      return [
        ...element.data.liquidities.map((l) => l.assets).flat(1),
        ...element.data.liquidities.map((l) => l.rewardAssets).flat(1),
      ];
    case PortfolioElementType.borrowlend:
      return [...element.data.suppliedAssets];
    case PortfolioElementType.leverage:
      return [...element.data.collateralAssets];
    default:
      return [];
  }
}
