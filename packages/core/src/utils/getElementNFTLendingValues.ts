import { PortfolioAsset } from '../Portfolio';
import { UsdValue } from '../UsdValue';

export function getElementNFTLendingValues(params: {
  suppliedAssets: PortfolioAsset[];
  borrowedAssets: PortfolioAsset[];
  lender: boolean;
}) {
  const { suppliedAssets, borrowedAssets, lender } = params;

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

  // Total value
  let value = null;

  if (borrowedValue == null) {
    // it's an offer
    value = suppliedValue;
  } else if (suppliedValue !== null) {
    if (lender) {
      // supplied sol, nft as collat
      value = Math.min(suppliedValue, borrowedValue);
    } else {
      // supplied nft as collat, borrow sol
      value = Math.max(suppliedValue - borrowedValue, 0);
    }
  }

  return {
    borrowedValue,
    suppliedValue,
    value,
  };
}
