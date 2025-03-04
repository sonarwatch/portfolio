import {
  PortfolioElementMultiple,
  PortfolioElementTrade,
  PortfolioElementType,
} from '../Portfolio';

export function portfolioElementTradeToMultiple(
  element: PortfolioElementTrade
): PortfolioElementMultiple {
  const assets = [];
  if (element.data.assets.input) assets.push(element.data.assets.input);
  if (element.data.assets.output) assets.push(element.data.assets.output);

  return {
    ...element,
    type: PortfolioElementType.multiple,
    data: {
      ...element.data,
      assets,
    },
  };
}
