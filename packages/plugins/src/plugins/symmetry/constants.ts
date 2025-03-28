import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'symmetry';
export const platform: Platform = {
  id: platformId,
  name: 'Symmetry',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/symmetry.webp',
  website: 'https://www.symmetry.fi/',
  twitter: 'https://twitter.com/symmetry_fi',
  defiLlamaId: 'symmetry', // from https://defillama.com/docs/api
  description: "Solana's on-chain asset management infrastructure layer",
  github: 'https://github.com/symmetry-protocol',
  discord: 'http://discord.gg/ahdqBRgE7G',
  documentation: 'https://docs.symmetry.fi/',
  medium: 'https://symmetry-fi.medium.com/',
  telegram: 'https://t.me/symmetry_fi',
};

export const basketsCachePrefix = `${platformId}-baskets`;
export const basketProgramId = new PublicKey(
  '2KehYt3KsEQR53jYcxjbQp2d2kCp4AkuQW68atufRwSr'
);
export const tokenListAddress = new PublicKey(
  '3SnUughtueoVrhevXTLMf586qvKNNXggNsc7NgoMUU1t'
);
