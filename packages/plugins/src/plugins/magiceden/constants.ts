import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'magiceden';
export const platform: Platform = {
  id: platformId,
  name: 'MagicEden',
  image: 'https://sonar.watch/img/platforms/magiceden.webp',
  website: 'https://magiceden.io/',
  twitter: 'https://twitter.com/MagicEden',
};

export const m2Prefix = 'm2';
export const m2Program = new PublicKey(
  'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K'
);
export const m2AuctionHouse = new PublicKey(
  'E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe'
);
export const stakingPid = new PublicKey(
  'veTbq5fF2HWYpgmkwjGKTYLVpY6miWYYmakML7R7LRf'
);
export const meMint = 'MEFNBXixkEbait3xn9bkm8WsJzXtVsaJEn4c8Sam21u';
