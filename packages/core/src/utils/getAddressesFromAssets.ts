import { PortfolioAsset } from '../Portfolio';
import { getAddressFromAsset } from './getAddressFromAsset';

export function getAddressesFromAssets(assets: PortfolioAsset[]): string[] {
  const addresses: Set<string> = new Set();
  assets.forEach((a) => {
    const address = getAddressFromAsset(a);
    if (address) addresses.add(address);
  });
  return [...addresses];
}
