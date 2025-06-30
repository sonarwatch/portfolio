import { getUsdValueSum } from './getUsdValueSum';
import {
  isPortfolioElementBorrowLend,
  isPortfolioElementLiquidity,
  isPortfolioElementMultiple,
} from './isPortfolioElement';
import { PortfolioAssetType, PortfolioElement } from '../Portfolio';
import { apyToApr, yieldFromApy, YieldItem, YieldSummary } from '../Yield';

const calcYieldItem = (element: PortfolioElement): YieldItem[] => {
  if (!element.value) return [];

  const yieldItems: YieldItem[] = [];

  if (isPortfolioElementMultiple(element)) {
    element.data.assets.forEach((asset) => {
      if (
        asset.type === PortfolioAssetType.token &&
        asset.data.yield &&
        asset.value
      ) {
        yieldItems.push({
          yield: asset.data.yield,
          value: asset.value,
          platformId: element.platformId,
        });
      }
    });
  }

  if (isPortfolioElementLiquidity(element)) {
    const liquidityYieldItems: YieldItem[] = [];
    element.data.liquidities.forEach((liquidity, i) => {
      if (liquidity.yields[i] && liquidity.value) {
        liquidityYieldItems.push({
          yield: liquidity.yields[i],
          value: liquidity.value,
          platformId: element.platformId,
        });
      }
      liquidity.assets.forEach((asset) => {
        if (
          asset.type === PortfolioAssetType.token &&
          asset.data.yield &&
          asset.value
        ) {
          liquidityYieldItems.push({
            yield: asset.data.yield,
            value: asset.value,
            platformId: element.platformId,
          });
        }
      });
    });

    yieldItems.push({
      yield: yieldFromApy(reduceYieldItems(liquidityYieldItems)),
      value: element.value,
      platformId: element.platformId,
    });
  }

  if (isPortfolioElementBorrowLend(element)) {
    const borrowLendYieldItems: YieldItem[] = [];

    element.data.suppliedAssets.forEach((asset, i) => {
      if (
        asset.type === PortfolioAssetType.token &&
        asset.data.yield &&
        asset.value
      ) {
        borrowLendYieldItems.push({
          yield: asset.data.yield,
          value: asset.value,
          platformId: element.platformId,
        });
      }
      if (
        element.data.suppliedYields[i] &&
        element.data.suppliedYields[i][0].apy > 0 &&
        asset.value
      ) {
        borrowLendYieldItems.push({
          yield: element.data.suppliedYields[i][0],
          value: asset.value,
          platformId: element.platformId,
        });
      }
    });
    element.data.borrowedAssets.forEach((asset, i) => {
      if (element.data.borrowedYields[i] && asset.value) {
        borrowLendYieldItems.push({
          yield: element.data.borrowedYields[i][0],
          value: asset.value,
          platformId: element.platformId,
        });
      }
    });

    yieldItems.push({
      yield: yieldFromApy(reduceYieldItems(borrowLendYieldItems)),
      value: element.value,
      platformId: element.platformId,
    });
  }

  if (yieldItems.length === 0) return [];

  return [
    {
      yield: yieldFromApy(reduceYieldItems(yieldItems)),
      value: element.value,
      platformId: element.platformId,
    },
  ];
};

const reduceYieldItems = (yieldItems: YieldItem[]) => {
  const value = getUsdValueSum(yieldItems.map((ye) => ye.value));
  return yieldItems
    .filter((ye) => ye.yield.apy !== 0)
    .reduce((sum, ye) => sum + (ye.yield.apy * ye.value) / value, 0);
};

export const calcYieldSummary = (
  elements: PortfolioElement[]
): YieldSummary => {
  const yieldItems = elements.flatMap((element) => {
    const yieldItem = calcYieldItem(element);
    if (yieldItem) return yieldItem;
    return [];
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
    items: yieldItems,
  };
};
