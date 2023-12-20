import { compareUsdValue } from './compareUsdValue';
import {
  PortfolioElement,
  PortfolioElementBorrowLend,
  PortfolioElementLiquidity,
  PortfolioElementMultiple,
  PortfolioElementType,
  PortfolioLiquidity,
} from '../Portfolio';
import { sortAssets } from './sortAssets';

export function sortPortfolioElement(
  element: PortfolioElement
): PortfolioElement {
  switch (element.type) {
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
  const sElement = element;
  sElement.data.borrowedAssets = sortAssets(sElement.data.borrowedAssets);
  sElement.data.suppliedAssets = sortAssets(sElement.data.suppliedAssets);
  sElement.data.rewardAssets = sortAssets(sElement.data.rewardAssets);
  return sElement;
}

export function sortElementLiquidity(
  element: PortfolioElementLiquidity
): PortfolioElementLiquidity {
  const sortedElement = element;
  sortedElement.data.liquidities = sortedElement.data.liquidities.map((l) =>
    sortPortfolioLiquidity(l)
  );
  sortedElement.data.liquidities.sort((a, b) =>
    compareUsdValue(a.value, b.value)
  );
  return sortedElement;
}

export function sortPortfolioLiquidity(
  portfolioLiquidity: PortfolioLiquidity
): PortfolioLiquidity {
  const sortedPortfolioLiquidity = portfolioLiquidity;
  sortedPortfolioLiquidity.assets = sortAssets(sortedPortfolioLiquidity.assets);
  sortedPortfolioLiquidity.rewardAssets = sortAssets(
    sortedPortfolioLiquidity.rewardAssets
  );
  return sortedPortfolioLiquidity;
}
