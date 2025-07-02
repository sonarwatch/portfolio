import { getUsdValueSum } from './getUsdValueSum';
import { PortfolioElement } from '../Portfolio';
import { apyToApr, YieldItem, YieldSummary } from '../Yield';

export const reduceYieldItems = (yieldItems: YieldItem[]) => {
  const value = getUsdValueSum(yieldItems.map((ye) => ye.value));
  return yieldItems
    .filter((ye) => ye.apy !== 0)
    .reduce((sum, ye) => sum + (ye.apy * ye.value) / value, 0);
};

export const calcYieldSummary = (
  elements: PortfolioElement[]
): YieldSummary => {
  const yieldItems = elements.flatMap((element) => {
    if (!element.value || !element.netApy) return [];
    return [
      {
        apy: element.netApy,
        value: element.value,
      },
    ];
  });

  const apy = reduceYieldItems(yieldItems);
  const apr = apyToApr(apy);
  const value = getUsdValueSum(elements.map((e) => e.value));

  const yearlyYield = {
    yield: {
      apr,
      apy,
    },
    revenue: {
      apr: (value * apr) / 100,
      apy: (value * apy) / 100,
    },
  };

  return {
    value,
    yearly: yearlyYield,
  };
};
