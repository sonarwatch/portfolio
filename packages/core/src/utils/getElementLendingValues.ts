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
  rewardAssets: PortfolioAsset[]
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
  const collateralRatio: number | null = getCollateralRatio(
    suppliedValue,
    borrowedValue
  );

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
    value,
  };
}
