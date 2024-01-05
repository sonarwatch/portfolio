import { compareUsdValue } from './compareUsdValue';
import {
  PortfolioElement,
  PortfolioElementBorrowLend,
  PortfolioElementLiquidity,
  PortfolioElementMultiple,
  PortfolioElementType,
  PortfolioLiquidity,
} from '../Portfolio';
import { sortMultipleAssets } from './sortAssets';

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
  sortedElement.data.assets = sortMultipleAssets(sortedElement.data.assets);
  return sortedElement;
}

export function sortElementBorrowLend(
  element: PortfolioElementBorrowLend
): PortfolioElementBorrowLend {
  const sE = element;
  sE.data.borrowedAssets = sortMultipleAssets(sE.data.borrowedAssets);
  sE.data.suppliedAssets = sortMultipleAssets(sE.data.suppliedAssets);
  sE.data.rewardAssets = sortMultipleAssets(sE.data.rewardAssets);
  return sE;
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
  const sLiquidity = portfolioLiquidity;
  sLiquidity.assets = sortMultipleAssets(sLiquidity.assets);
  sLiquidity.rewardAssets = sortMultipleAssets(sLiquidity.rewardAssets);
  return sLiquidity;
}
