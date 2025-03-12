import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'cropper';
export const crpMint = '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr';
export const platform: Platform = {
  id: platformId,
  name: 'Cropper',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/cropper.webp',
  website: 'https://cropper.finance/',
  twitter: 'https://twitter.com/CropperFinance',
  defiLlamaId: 'cropper-clmm', // from https://defillama.com/docs/api
  tokens: [crpMint],
  isDeprecated: true,
  description:
    'Cropper is an decentralized exchange built on the Solana blockchain.',
  github: 'https://github.com/CropperFinance',
  documentation: 'https://docs.cropper.finance/cropperfinance',
  telegram: 'https://t.me/CropperFinance',
  medium: 'https://cropperfinance.medium.com/',
};

export const clmmPid = new PublicKey(
  'H8W3ctz92svYg6mkn1UtGfu2aQr2fnUFHM1RhScEtQDt'
);
