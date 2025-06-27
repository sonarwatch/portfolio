import {
  PortfolioAssetType,
  PortfolioElement,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '../Portfolio';
import { TokenPriceMap } from './TokenPriceMap';
import { fixUsdValue } from './fixUsdValue';

export const applyPricesToElements = (
  elements: PortfolioElement[],
  tokenPrices: TokenPriceMap
): PortfolioElement[] => {
  if (!tokenPrices || !Object.keys(tokenPrices).length) return elements;
  return elements.map((element) => applyPricesToElement(element, tokenPrices));
};

export const applyPricesToElement = (
  element: PortfolioElement,
  tokenPrices: TokenPriceMap
): PortfolioElement => {
  if (element.networkId !== tokenPrices.networkId) return element;

  if (element.type === PortfolioElementType.multiple) {
    const assets = element.data.assets.map((asset) => {
      if (asset.type === PortfolioAssetType.token) {
        const tokenPrice = tokenPrices.get(asset.data.address);
        if (!tokenPrice) return asset;
        if (tokenPrice.price === undefined) return asset;

        return {
          ...asset,
          data: {
            ...asset.data,
            price: tokenPrice.price,
          },
          value: fixUsdValue(tokenPrice.price * asset.data.amount),
        };
      }
      return asset;
    });

    return {
      ...element,
      data: {
        ...element.data,
        assets,
        value: assets.reduce((acc, asset) => acc + (asset.value || 0), 0),
      },
    } as PortfolioElementMultiple;
  }

  return element;
};
