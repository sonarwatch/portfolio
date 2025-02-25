import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'metaplex';
export const platform: Platform = {
  id: platformId,
  name: 'Metaplex',
  image: 'https://sonar.watch/img/platforms/metaplex.webp',
  website: 'https://resize.metaplex.com',
  twitter: 'https://x.com/metaplex',
  // defiLlamaId: 'metaplex', // from https://defillama.com/docs/api
};

export const amountPerMasterEdition = 0.00232464;
export const amountPerBasicEdition = 0.00188616;
export const metadatProgram = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);
