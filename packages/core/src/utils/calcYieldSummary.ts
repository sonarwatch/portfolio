import { getUsdValueSum } from './getUsdValueSum';
import {
  isPortfolioElementBorrowLend,
  isPortfolioElementLiquidity,
  isPortfolioElementMultiple,
} from './isPortfolioElement';
import { PortfolioAssetType, PortfolioElement } from '../Portfolio';
import { YieldItem, YieldSummary } from '../Yield';

export const calcYieldSummary = (
  elements: PortfolioElement[]
): YieldSummary => {
  const yieldElements: YieldItem[] = [];

  elements.forEach((element) => {
    if (isPortfolioElementMultiple(element)) {
      element.data.assets.forEach((asset) => {
        if (
          asset.type === PortfolioAssetType.token &&
          asset.data.yield &&
          asset.value
        ) {
          yieldElements.push({
            yield: asset.data.yield,
            value: asset.value,
            platformId: element.platformId,
          });
        }
      });
    } else if (isPortfolioElementLiquidity(element)) {
      element.data.liquidities.forEach((liquidity) => {
        liquidity.assets.forEach((asset, i) => {
          if (liquidity.yields[i] && liquidity.value) {
            yieldElements.push({
              yield: liquidity.yields[i],
              value: liquidity.value,
              platformId: element.platformId,
            });
          }
        });
      });
    } else if (isPortfolioElementBorrowLend(element)) {
      element.data.suppliedAssets.forEach((asset, i) => {
        if (element.data.suppliedYields[i] && asset.value) {
          yieldElements.push({
            yield: element.data.suppliedYields[i][0],
            value: asset.value,
            platformId: element.platformId,
          });
        }
      });
    }
  });

  const value = getUsdValueSum(elements.map((e) => e.value));

  const monthlyYield = {
    yield: {
      apr:
        yieldElements.reduce(
          (sum, ye) => sum + (ye.yield.apr * ye.value) / value,
          0
        ) / 12,
      apy:
        yieldElements.reduce(
          (sum, ye) => sum + (ye.yield.apy * ye.value) / value,
          0
        ) / 12,
    },
    revenue: {
      apr: yieldElements
        .map((ye) => (ye.yield.apr / 12) * ye.value)
        .reduce(
          (sum: number, currUsdValue) =>
            currUsdValue !== null ? sum + currUsdValue : sum,
          0
        ),
      apy: yieldElements
        .map((ye) => (ye.yield.apy / 12) * ye.value)
        .reduce(
          (sum: number, currUsdValue) =>
            currUsdValue !== null ? sum + currUsdValue : sum,
          0
        ),
    },
  };

  return {
    value,
    monthly: monthlyYield,
    items: yieldElements,
  };
};
