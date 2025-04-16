import {
  PortfolioElement,
  PortfolioElementLiquidity,
} from '@sonarwatch/portfolio-core';

export function isPortfolioElementLiquidity(
  element: PortfolioElement | null
): element is PortfolioElementLiquidity {
  return !!element && element.type === 'liquidity';
}
