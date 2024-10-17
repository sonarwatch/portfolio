import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'sandglass';
export const platform: Platform = {
  id: platformId,
  name: 'Sandglass',
  image: 'https://sonar.watch/img/platforms/sandglass.webp',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://sandglass.so/',
  twitter: 'https://twitter.com/sandglass_so',
};

export const programId = new PublicKey(
  'SANDsy8SBzwUE8Zio2mrYZYqL52Phr2WQb9DDKuXMVK'
);
export const marketsInfoKey = 'markets';

export const marketNameByAddress = new Map([
  ['6SbYW288Kje2WD6TRRcAmikhA76cijBi36y1wYt4RsdN', 'JLP'],
  ['4K9VeqpZNCVHtZN9mKJpTihp4N8a9LeS35qBnqqM83Et', 'bSOL'],
  ['Amu99crLdqbfpzrBbfrXHu1myWoCNXrSu7RRkHZJ1Ymv', 'mSOL'],
  ['5ofpU1rU4ajg3LuHKSMBBWHDubTW1XF7x6tCAXsk5Gju', 'JitoSOL'],
  ['B8V6WVjPxW1UGwVDfxH2d2r8SyT4cqn7dQRK6XneVa7D', 'cUSDC'],
]);
