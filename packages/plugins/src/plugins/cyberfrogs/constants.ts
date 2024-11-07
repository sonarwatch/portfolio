import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'cyberfrogs';
export const platform: Platform = {
  id: platformId,
  name: 'CyberFrogs Thor',
  image: 'https://sonar.watch/img/platforms/cyberfrogs.webp',
  website: 'https://legacy.cyberfrogs.io/faction-contracts-v3',
  twitter: 'https://twitter.com/CyberFrogsNFT',
};

export const pid = new PublicKey(
  '8F2VM13kdMBaHtcXPHmArtLueg7rfsa3gnrgGjAy4oCu'
);
