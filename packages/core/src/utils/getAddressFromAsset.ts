import { PortfolioAsset } from '../Portfolio';

export function getAddressFromAsset(
  asset: PortfolioAsset,
  tokenOnly = false
): string | null {
  switch (asset.type) {
    case 'token':
      return asset.data.address;
    case 'collectible':
      if (tokenOnly) return null;
      return asset.data.address;
    case 'generic':
      if (tokenOnly) return null;
      return asset.data.address || null;
    default:
      return null;
  }
}
