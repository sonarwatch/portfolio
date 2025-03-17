import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'metaplex';
export const platform: Platform = {
  id: platformId,
  name: 'Metaplex',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/metaplex.webp',
  website: 'https://resize.metaplex.com',
  twitter: 'https://x.com/metaplex',
  // defiLlamaId: 'metaplex', // from https://defillama.com/docs/api
  discord: 'discord.gg/metaplex',
  github: 'https://github.com/metaplex-foundation',
  documentation: 'https://www.metaplex.com/guides',
  tokens: ['METAewgxyPbgwsseH8T16a39CQ5VyVxZi9zXiDPY18m'],
  description: 'Build decentralizedapplications on Solana and the SVM',
};

export const amountPerMasterEdition = 0.00232464;
export const amountPerBasicEdition = 0.00188616;
export const metadatProgram = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);
