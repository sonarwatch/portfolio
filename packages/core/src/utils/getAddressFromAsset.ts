import { PortfolioAsset } from '../Portfolio';

export function getAddressFromAsset(asset: PortfolioAsset): string | null {
  switch (asset.type) {
    case 'token':
      return asset.data.address;
    case 'collectible':
      return asset.data.address;
    case 'generic':
      return asset.data.address || null;
    default:
      return null;
  }
}
