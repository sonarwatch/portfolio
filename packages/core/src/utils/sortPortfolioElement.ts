import { compareUsdValue } from './compareUsdValue';
import {
  PortfolioElement,
  PortfolioElementBorrowLend,
  PortfolioElementLeverage,
  PortfolioElementLiquidity,
  PortfolioElementMultiple,
  PortfolioElementTrade,
  PortfolioElementType,
  PortfolioLiquidity,
} from '../Portfolio';
import { sortAssetsWithYields, sortMultipleAssets } from './sortAssets';

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
    case PortfolioElementType.leverage:
      return sortElementLeverage(element);
    case PortfolioElementType.trade:
      return sortElementTrade(element);
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

  // Borrows
  const sortedBorrowedAssetsAndYields = sortAssetsWithYields(
    sE.data.borrowedAssets,
    sE.data.borrowedYields
  );
  sE.data.borrowedAssets = sortedBorrowedAssetsAndYields.sortedAssets;
  sE.data.borrowedYields = sortedBorrowedAssetsAndYields.sortedYields;

  // Supplies
  const sortedSuppliedAssetsAndYields = sortAssetsWithYields(
    sE.data.suppliedAssets,
    sE.data.suppliedYields
  );
  sE.data.suppliedAssets = sortedSuppliedAssetsAndYields.sortedAssets;
  sE.data.suppliedYields = sortedSuppliedAssetsAndYields.sortedYields;

  // Rewards
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

export function sortElementLeverage(
  element: PortfolioElementLeverage
): PortfolioElementLeverage {
  const sortedElement: PortfolioElementLeverage = { ...element };
  sortedElement.data.isolated?.positions.sort((a, b) =>
    compareUsdValue(a.value, b.value)
  );
  sortedElement.data.cross?.positions.sort((a, b) =>
    compareUsdValue(a.value, b.value)
  );
  return sortedElement;
}

export function sortElementTrade(
  element: PortfolioElementTrade
): PortfolioElementTrade {
  return element;
}
