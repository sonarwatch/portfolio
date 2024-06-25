import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'cropper';
export const platform: Platform = {
  id: platformId,
  name: 'Cropper',
  image: 'https://sonar.watch/img/platforms/cropper.webp',
  website: 'https://cropper.finance/',
  twitter: 'https://twitter.com/CropperFinance',
  defiLlamaId: 'cropper-clmm', // from https://defillama.com/docs/api
};

export const clmmPid = new PublicKey(
  'H8W3ctz92svYg6mkn1UtGfu2aQr2fnUFHM1RhScEtQDt'
);
