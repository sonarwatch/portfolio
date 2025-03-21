import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'elemental';
export const platform: Platform = {
  id: platformId,
  name: 'Elemental',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/elemental.webp',
  website: 'https://elemental.fund/',
  twitter: 'https://twitter.com/elementaldefi',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  documentation: 'https://docs.elemental.fund/',
  telegram: 'https://tg.elemental.fund',
  description:
    'Solana-based crypto fund dedicated to making DeFi investing simple',
  github: 'https://github.com/elementalfund',
};
export const poolsCacheKey = `pools`;

export const programId = new PublicKey(
  'ELE5vYY81W7UCpTPs7SyD6Bwm5FwZBntTW8PiGqM5d4A'
);
