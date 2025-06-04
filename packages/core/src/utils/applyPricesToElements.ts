import {
  PortfolioAssetType,
  PortfolioElement,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '../Portfolio';
import { TokenPriceMap } from './TokenPriceMap';

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
    return {
      ...element,
      data: {
        ...element.data,
        assets: element.data.assets.map((asset) => {
          if (asset.type === PortfolioAssetType.token) {
            const tokenPrice = tokenPrices.get(asset.data.address);
            if (!tokenPrice) return asset;

            return {
              ...asset,
              data: {
                ...asset.data,
                price: tokenPrice.price,
              },
              value: tokenPrice.price * asset.data.amount,
            };
          }
          return asset;
        }),
        value: element.data.assets.reduce(
          (acc, asset) => acc + (asset.value || 0),
          0
        ),
      },
    } as PortfolioElementMultiple;
  }

  return element;
};
