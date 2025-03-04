import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'goosefx';
export const platform: Platform = {
  id: platformId,
  name: 'GooseFX',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/goosefx.webp',
  defiLlamaId: 'goosefx', // from https://defillama.com/docs/api
  website: 'https://app.goosefx.io/farm',
  // twitter: 'https://twitter.com/myplatform',
};

export const programId = new PublicKey(
  'GFXsSL5sSaDfNFQUYsHekbWBW1TsFdjDYzACh62tEHxn'
);

export const stakerProgramId = new PublicKey(
  'STKRWxT4irmTthSJydggspWmkc3ovYHx62DHLPVv1f1'
);

export const gofxMint = 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD';
