import { PortfolioAsset } from '../Portfolio';
import { UsdValue } from '../UsdValue';

function getCollateralRatio(suppliedValue: UsdValue, borrowedValue: UsdValue) {
  let collateralRatio: number | null = null;
  if (borrowedValue === 0) {
    collateralRatio = -1;
  } else if (suppliedValue && borrowedValue) {
    collateralRatio = suppliedValue / borrowedValue;
  }
  return collateralRatio;
}

export function getElementLendingValues(
  suppliedAssets: PortfolioAsset[],
  borrowedAssets: PortfolioAsset[],
  rewardAssets: PortfolioAsset[],
  suppliedLTVs?: number[],
  borrowedWeights?: number[]
) {
  const rewardsValue: UsdValue = rewardAssets.reduce(
    (acc: UsdValue, asset) =>
      acc !== null && asset.value !== null ? acc + asset.value : null,
    0
  );
  const suppliedValue: UsdValue = suppliedAssets.reduce(
    (acc: UsdValue, asset) =>
      acc !== null && asset.value !== null ? acc + asset.value : null,
    0
  );
  const borrowedValue: UsdValue = borrowedAssets.reduce(
    (acc: UsdValue, asset) =>
      acc !== null && asset.value !== null ? acc + asset.value : null,
    0
  );
  const collateralRatio = getCollateralRatio(suppliedValue, borrowedValue);

  let healthRatio = -1;
  if (borrowedWeights && suppliedLTVs) {
    const suppliesWeightedValue: number = suppliedAssets.reduce(
      (acc: number, asset, index) =>
        acc !== null && asset.value !== null
          ? acc + asset.value * suppliedLTVs[index]
          : 0,
      0
    );
    const borrowsWeightedValue: number = borrowedAssets.reduce(
      (acc: number, asset, index) =>
        acc !== null && asset.value !== null
          ? acc + asset.value * borrowedWeights[index]
          : 0,
      0
    );
    healthRatio =
      (suppliesWeightedValue - borrowsWeightedValue) / suppliesWeightedValue;
  }

  // Total value
  let value =
    suppliedValue !== null && borrowedValue !== null
      ? suppliedValue - borrowedValue
      : null;
  if (rewardsValue !== null && value !== null) value += rewardsValue;

  return {
    borrowedValue,
    suppliedValue,
    rewardsValue,
    collateralRatio,
    healthRatio,
    value,
  };
}
