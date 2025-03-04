import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'tradeport';
export const platform: Platform = {
  id: platformId,
  name: 'Tradeport',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/tradeport.webp',
  website: 'https://www.tradeport.xyz/',
  twitter: 'https://x.com/tradeportxyz',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
};
export const locksCacheKey = `locks`;
export const bidsCacheKey = `bids`;

export const lockStore =
  '0x4b705de46a79b29276baf45009bc7d6f70cc0f1407f0c9e03cac5729c0c47946';
export const bidsStore =
  '0x1e5e7f38e3a61d1d189506d0fc6b7e47e935a292d9e1b23c0f3f1c0f94227772';
export const bidsType =
  '0xec175e537be9e48f75fa6929291de6454d2502f1091feb22c0d26a22821bbf28::kiosk_biddings::Bid';
export const escrowType =
  '0xec175e537be9e48f75fa6929291de6454d2502f1091feb22c0d26a22821bbf28::kiosk_biddings::Escrow';
