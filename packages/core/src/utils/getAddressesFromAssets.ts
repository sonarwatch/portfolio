import { PortfolioAsset } from '../Portfolio';
import { getAddressFromAsset } from './getAddressFromAsset';

export function getAddressesFromAssets(assets: PortfolioAsset[]): string[] {
  const addresses: string[] = [];
  assets.forEach((a) => {
    const address = getAddressFromAsset(a);
    if (address) addresses.push(address);
  });
  return addresses;
}
