import { PortfolioAsset } from '../Portfolio';
import { compareName } from './compareName';
import { compareUsdValue } from './compareUsdValue';

export function sortAssets(assets: PortfolioAsset[]) {
  const sortedAssets = [...assets];
  sortedAssets.sort((a, b) => {
    let result = compareUsdValue(a.value, b.value);
    if (result === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = compareName((a as any).name, (b as any).name);
    }
    return result;
  });
  return sortedAssets;
}
