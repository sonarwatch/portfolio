import { compareUsdValue } from './compareUsdValue';
import { compareName } from './compareName';
import {
  PortfolioElement,
  PortfolioElementBorrowLend,
  PortfolioElementLiquidity,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '../Portfolio';

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
  sortedElement.data.assets.sort((a, b) => {
    let result = compareUsdValue(a.value, b.value);
    if (result === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = compareName((a as any).name, (b as any).name);
    }
    return result;
  });
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
