import { PortfolioAsset } from '../Portfolio';
import { UsdValue } from '../UsdValue';

function getHealthRatio(
  suppliedAssets: PortfolioAsset[],
  borrowedAssets: PortfolioAsset[],
  suppliedLtvs?: number[],
  borrowedWeights?: number[]
): number | null {
  if (!suppliedLtvs) return null;
  if (suppliedLtvs && suppliedLtvs.length !== suppliedAssets.length)
    throw new Error('suppliedLtvs length doesnt match suppliedAssets');
  if (borrowedAssets.length === 0) return 1;

  const fBorrowedWeights =
    borrowedWeights || new Array<number>(borrowedAssets.length).fill(1);
  if (fBorrowedWeights.length !== borrowedAssets.length)
    throw new Error('borrowedWeights length doesnt match borrowedAssets');

  const suppliesWeightedValue: number = suppliedAssets.reduce(
    (acc: number, asset, index) =>
      acc !== null && asset.value !== null
        ? acc + asset.value * suppliedLtvs[index]
        : 0,
    0
  );
  const borrowsWeightedValue: number = borrowedAssets.reduce(
    (acc: number, asset, index) =>
      acc !== null && asset.value !== null
        ? acc + asset.value * fBorrowedWeights[index]
        : 0,
    0
  );
  return (suppliesWeightedValue - borrowsWeightedValue) / suppliesWeightedValue;
}

export function getElementLendingValues(
  suppliedAssets: PortfolioAsset[],
  borrowedAssets: PortfolioAsset[],
  rewardAssets: PortfolioAsset[],
  suppliedLtvs?: number[],
  borrowedWeights?: number[]
) {
  const rewardValue: UsdValue = rewardAssets.reduce(
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
  const healthRatio = getHealthRatio(
    suppliedAssets,
    borrowedAssets,
    suppliedLtvs,
    borrowedWeights
  );

  // Total value
  let value =
    suppliedValue !== null && borrowedValue !== null
      ? suppliedValue - borrowedValue
      : null;
  if (rewardValue !== null && value !== null) value += rewardValue;

  return {
    borrowedValue,
    suppliedValue,
    rewardValue,
    healthRatio,
    value,
  };
}
