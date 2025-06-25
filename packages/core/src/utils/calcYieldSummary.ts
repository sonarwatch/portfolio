import { getUsdValueSum } from './getUsdValueSum';
import {
  isPortfolioElementBorrowLend,
  isPortfolioElementLiquidity,
  isPortfolioElementMultiple,
} from './isPortfolioElement';
import { PortfolioAssetType, PortfolioElement } from '../Portfolio';
import { apyToApr, yieldFromApy, YieldItem, YieldSummary } from '../Yield';

const reduceYieldItems = (yieldItems: YieldItem[]) => {
  const value = getUsdValueSum(yieldItems.map((ye) => ye.value));
  const apy = yieldItems.reduce(
    (sum, ye) => sum + (ye.yield.apr * ye.value) / value,
    0
  );
  return {
    value,
    apy,
  };
};

export const calcYieldSummary = (
  elements: PortfolioElement[]
): YieldSummary => {
  const yieldItems: YieldItem[] = [];

  elements.forEach((element) => {
    if (!element.value) return;
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
    } else if (isPortfolioElementLiquidity(element)) {
      element.data.liquidities.forEach((liquidity) => {
        liquidity.assets.forEach((asset, i) => {
          if (liquidity.yields[i] && liquidity.value && asset.value) {
            yieldItems.push({
              yield: liquidity.yields[i],
              value: asset.value,
              platformId: element.platformId,
            });
          }
        });
      });
    } else if (isPortfolioElementBorrowLend(element)) {
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
      const { apy } = reduceYieldItems(borrowLendYieldItems);
      yieldItems.push({
        yield: yieldFromApy(apy),
        value: element.value,
        platformId: element.platformId,
      });
    }
  });

  const { apy } = reduceYieldItems(yieldItems);
  const apr = apyToApr(apy);
  const value = getUsdValueSum(elements.map((e) => e.value));

  const yearlyYield = {
    yield: {
      apr,
      apy,
    },
    revenue: {
      apr: value * apr,
      apy: value * apy,
    },
  };

  return {
    value,
    yearly: yearlyYield,
    items: yieldItems,
  };
};
