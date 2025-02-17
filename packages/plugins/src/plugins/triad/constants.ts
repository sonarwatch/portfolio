import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'triad';
export const platform: Platform = {
  id: platformId,
  name: 'Triad',
  image: 'https://sonar.watch/img/platforms/triad.webp',
  website: 'https://app.triadfi.co/',
  twitter: 'https://x.com/triadfi',
};

export const programId = new PublicKey(
  'TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss'
);
