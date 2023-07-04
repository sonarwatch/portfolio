import { PortfolioElement } from '../Portfolio';
import { compareUsdValue } from './compareUsdValue';
import { sortPortfolioElement } from './sortPortfolioElement';

export function sortPortfolioElements(
  elements: PortfolioElement[]
): PortfolioElement[] {
  const sortedElements = [...elements].map((e) => sortPortfolioElement(e));
  sortedElements.sort((a, b) => compareUsdValue(a.value, b.value));
  return sortedElements;
}
