import {
  PortfolioElement,
  PortfolioElementBorrowLend,
  PortfolioElementLeverage,
  PortfolioElementLiquidity,
  PortfolioElementMultiple,
  PortfolioElementTrade,
} from '../Portfolio';

export function isPortfolioElementLiquidity(
  element: PortfolioElement | null
): element is PortfolioElementLiquidity {
  return !!element && element.type === 'liquidity';
}
export function isPortfolioElementMultiple(
  element: PortfolioElement | null
): element is PortfolioElementMultiple {
  return !!element && element.type === 'multiple';
}
export function isPortfolioElementLeverage(
  element: PortfolioElement | null
): element is PortfolioElementLeverage {
  return !!element && element.type === 'leverage';
}
export function isPortfolioElementBorrowLend(
  element: PortfolioElement | null
): element is PortfolioElementBorrowLend {
  return !!element && element.type === 'borrowlend';
}
export function isPortfolioElementTrade(
  element: PortfolioElement | null
): element is PortfolioElementTrade {
  return !!element && element.type === 'trade';
}
