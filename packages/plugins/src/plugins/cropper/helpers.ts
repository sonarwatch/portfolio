import { PortfolioAssetCollectible } from '@sonarwatch/portfolio-core';

export function isClmmPosition(nft: PortfolioAssetCollectible): boolean {
  return nft.data.name?.startsWith('Cropper CLMM Position') === true;
}
