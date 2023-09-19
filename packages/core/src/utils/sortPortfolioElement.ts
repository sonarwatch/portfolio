import { compareUsdValue } from './compareUsdValue';
import {
  PortfolioElement,
  PortfolioElementBorrowLend,
  PortfolioElementLiquidity,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '../Portfolio';
import { sortAssets } from './sortAssets';

export function sortPortfolioElement(
  element: PortfolioElement
): PortfolioElement {
  switch (element.type) {
    case PortfolioElementType.single:
      return element;
    case PortfolioElementType.multiple:
      return sortElementMultiple(element);
    case PortfolioElementType.borrowlend:
      return sortElementBorrowLend(element);
    case PortfolioElementType.liquidity:
      return sortElementLiquidity(element);
    default:
      return element;
  }
}

export function sortElementMultiple(
  element: PortfolioElementMultiple
): PortfolioElementMultiple {
  const sortedElement = element;
  sortedElement.data.assets = sortAssets(sortedElement.data.assets);
  return sortedElement;
}

export function sortElementBorrowLend(
  element: PortfolioElementBorrowLend
): PortfolioElementBorrowLend {
  const sortedElement = element;
  return sortedElement;
}

export function sortElementLiquidity(
  element: PortfolioElementLiquidity
): PortfolioElementLiquidity {
  const sortedElement = element;
  sortedElement.data.liquidities.sort((a, b) =>
    compareUsdValue(a.value, b.value)
  );
  return sortedElement;
}
