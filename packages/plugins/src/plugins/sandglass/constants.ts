import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { usdcSolanaMint } from '../../utils/solana';

export const platformId = 'sandglass';
export const platform: Platform = {
  id: platformId,
  name: 'Sandglass',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/sandglass.webp',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://sandglass.so/',
  twitter: 'https://twitter.com/sandglass_so',
  discord: 'https://discord.gg/jSNe84QZ67',
  medium:
    'https://medium.com/@lifinity.io/introducing-sandglass-a-yield-trading-protocol-on-solana-9b5ee5b33aff',
};

export const programId = new PublicKey(
  'SANDsy8SBzwUE8Zio2mrYZYqL52Phr2WQb9DDKuXMVK'
);
export const marketsInfoKey = 'markets';

export const marketNameByAddress = new Map([
  ['6SbYW288Kje2WD6TRRcAmikhA76cijBi36y1wYt4RsdN', 'JLP'],
  ['4TwkkaaDHyKhqDh59JYrYCGyRf9FRwDmGgvwwXyVzwYs', 'cUSDC'],
  ['9s19JHfKLMmw2b8yP6xdhE5jEqZYsJj6jL8SexAgLTeC', 'cUSDC'],
  ['BSrrKn29jrEbag3QRyH7qy4pcMZ9mXEp9Sqfs9iW5fmK', 'cPYUSD'],
  ['B4mgGx4HHYMsWYv2dbJyNHtCNFx5dfUUt1EJYicEMNPp', 'cUSDC'],
  ['Amu99crLdqbfpzrBbfrXHu1myWoCNXrSu7RRkHZJ1Ymv', 'mSOL'],
  ['5ofpU1rU4ajg3LuHKSMBBWHDubTW1XF7x6tCAXsk5Gju', 'JitoSOL'],
  ['4K9VeqpZNCVHtZN9mKJpTihp4N8a9LeS35qBnqqM83Et', 'bSOL'],
]);

export const tokenWrappers: { [key: string]: string } = {
  B8V6WVjPxW1UGwVDfxH2d2r8SyT4cqn7dQRK6XneVa7D: usdcSolanaMint,
  '2RxduzB4xWZRBm5PpdBZmDfVbGFiGD2BJcGSaVZ3tQ8K': usdcSolanaMint,
  '32XLsweyeQwWgLKRVAzS72nxHGU1JmmNQQZ3C3q6fBjJ': usdcSolanaMint,
  FboVKpN3Wbxn2h2BA6YcT43ae4pR4kRmCjDeYVr83z77:
    '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo', // PYUSD
};
