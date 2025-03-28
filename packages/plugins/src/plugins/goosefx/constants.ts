import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'goosefx';
export const gofxMint = 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD';
export const platform: Platform = {
  id: platformId,
  name: 'GooseFX',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/goosefx.webp',
  defiLlamaId: 'goosefx', // from https://defillama.com/docs/api
  website: 'https://app.goosefx.io/',
  twitter: 'https://x.com/GooseFX1',
  discord: 'https://discord.com/invite/cDEPXpY26q',
  telegram: 'https://www.t.me/goosefx',
  tokens: [gofxMint],
  description:
    'The best place to earn and farm yield on your assets with our AMMs. Simple, fast, and efficient.  ',
};

export const programId = new PublicKey(
  'GFXsSL5sSaDfNFQUYsHekbWBW1TsFdjDYzACh62tEHxn'
);

export const stakerProgramId = new PublicKey(
  'STKRWxT4irmTthSJydggspWmkc3ovYHx62DHLPVv1f1'
);
