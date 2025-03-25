import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'loopscale';
export const platform: Platform = {
  id: platformId,
  name: 'Loopscale',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/loopscale.webp',
  website: 'https://app.loopscale.com/',
  twitter: 'https://x.com/LoopscaleLabs',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  documentation: 'https://docs.loopscale.com/',
  discord: 'https://discord.gg/loopscale',
  github: 'https://github.com/bridgesplit',
  description:
    'Loopscale is a new way to lend and borrow onchain with the best rates, any asset, and less risk.',
};
export const vaultsCacheKey = `vaults`;

export const loopscaleProgramId = new PublicKey(
  '1oopBoJG58DgkUVKkEzKgyG9dvRmpgeEm1AVjoHkF78'
);
