import {
  PortfolioAsset,
  PortfolioAssetCollectible,
  PortfolioAssetGeneric,
  PortfolioAssetToken,
  PortfolioAssetType,
} from '../Portfolio';
import { compareName } from './compareName';
import { compareUsdValue } from './compareUsdValue';

export function sortMultipleAssets(assets: PortfolioAsset[]) {
  const sortedAssets = [...assets];
  sortedAssets.sort((a, b) => {
    if (
      a.type === PortfolioAssetType.token &&
      b.type === PortfolioAssetType.token
    ) {
      return sortAssetTokens(a, b);
    }
    if (
      a.type === PortfolioAssetType.collectible &&
      b.type === PortfolioAssetType.collectible
    ) {
      return sortAssetCollectibles(a, b);
    }
    if (
      a.type === PortfolioAssetType.generic &&
      b.type === PortfolioAssetType.generic
    ) {
      return sortAssetGenerics(a, b);
    }
    if (a.type === b.type) {
      return compareUsdValue(a.value, b.value);
    }

    if (a.type === PortfolioAssetType.generic) return 1;
    if (b.type === PortfolioAssetType.generic) return -1;
    if (a.type === PortfolioAssetType.token) return 1;
    if (b.type === PortfolioAssetType.token) return -1;
    if (a.type === PortfolioAssetType.collectible) return 1;
    if (b.type === PortfolioAssetType.collectible) return -1;
    return 0;
  });
  return sortedAssets;
}

export function sortAssetCollectibles(
  a: PortfolioAssetCollectible,
  b: PortfolioAssetCollectible
) {
  let r = compareUsdValue(a.value, b.value);
  if (r === 0) r = compareName(a.data.collection?.id, b.data.collection?.id);
  if (r === 0) r = compareName(a.data.name, b.data.name);
  return r;
}

export function sortAssetTokens(
  a: PortfolioAssetToken,
  b: PortfolioAssetToken
) {
  let r = compareUsdValue(a.value, b.value);
  if (r === 0) r = compareName(a.data.address, b.data.address);
  return r;
}

export function sortAssetGenerics(
  a: PortfolioAssetGeneric,
  b: PortfolioAssetGeneric
) {
  let r = compareUsdValue(a.value, b.value);
  if (r === 0) r = compareName(a.data.name, b.data.name);
  return r;
}
