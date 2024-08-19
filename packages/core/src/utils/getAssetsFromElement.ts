import {
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
} from '../Portfolio';

export function getLongAssetsFromElement(
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
      return [
        ...element.data.suppliedAssets,
        ...element.data.rewardAssets,
        ...(element.data.unsettled?.assets || []),
      ];
    case PortfolioElementType.leverage:
      return [];
    default:
      return [];
  }
}

export function getShortAssetsFromElement(
  element: PortfolioElement
): PortfolioAsset[] {
  switch (element.type) {
    case PortfolioElementType.multiple:
      return [];
    case PortfolioElementType.liquidity:
      return [];
    case PortfolioElementType.borrowlend:
      return [...element.data.borrowedAssets];
    case PortfolioElementType.leverage:
      return [];
    default:
      return [];
  }
}

export function getAssetsFromElement(
  element: PortfolioElement
): PortfolioAsset[] {
  return [
    ...getLongAssetsFromElement(element),
    ...getShortAssetsFromElement(element),
  ];
}
