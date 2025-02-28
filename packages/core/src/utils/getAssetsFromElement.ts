import {
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
} from '../Portfolio';

export function getLongAssetsFromElement(
  element: PortfolioElement
): PortfolioAsset[] {
  switch (element.type) {
    case PortfolioElementType.multiple: {
      return [...element.data.assets];
    }

    case PortfolioElementType.liquidity: {
      return [
        ...element.data.liquidities.map((l) => l.assets).flat(1),
        ...element.data.liquidities.map((l) => l.rewardAssets).flat(1),
      ];
    }

    case PortfolioElementType.borrowlend: {
      return [
        ...element.data.suppliedAssets,
        ...element.data.rewardAssets,
        ...(element.data.unsettled?.assets || []),
      ];
    }

    case PortfolioElementType.leverage: {
      return [];
    }

    case PortfolioElementType.trade: {
      const assets: PortfolioAsset[] = [];
      if (element.data.assets.input) assets.push(element.data.assets.input);
      if (element.data.assets.output) assets.push(element.data.assets.output);
      return assets;
    }

    default: {
      return [];
    }
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
    case PortfolioElementType.trade:
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
