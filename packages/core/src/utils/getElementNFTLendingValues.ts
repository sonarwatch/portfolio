import { PortfolioAsset } from '../Portfolio';
import { UsdValue } from '../UsdValue';

export function getElementNFTLendingValues(params: {
  suppliedAssets: PortfolioAsset[];
  borrowedAssets: PortfolioAsset[];
  rewardAssets: PortfolioAsset[];
  lender: boolean;
}) {
  const { suppliedAssets, borrowedAssets, rewardAssets, lender } = params;

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
  const rewardValue: UsdValue = rewardAssets.reduce(
    (acc: UsdValue, asset) =>
      acc !== null && asset.value !== null ? acc + asset.value : null,
    0
  );

  // Total value
  let value = null;
  if (borrowedValue === null || borrowedValue === 0) {
    // it's an offer
    value = suppliedValue;
  } else if (suppliedValue !== null && suppliedValue !== 0) {
    if (lender) {
      // supplied sol, nft as collat
      value = Math.min(suppliedValue, borrowedValue);
    } else {
      // supplied nft as collat, borrow sol
      value = Math.max(suppliedValue - borrowedValue, 0);
    }
  }
  if (rewardValue !== null && value !== null) value += rewardValue;

  return {
    borrowedValue,
    suppliedValue,
    rewardValue,
    value,
  };
}
