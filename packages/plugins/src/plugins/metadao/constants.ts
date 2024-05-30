import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'metadao';
export const platform: Platform = {
  id: platformId,
  name: 'Metadao',
  image: 'https://sonar.watch/img/platforms/metadao.webp',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://futarchy.metadao.fi/',
  twitter: 'https://x.com/MetaDAOProject',
};

export const vaultPid = new PublicKey(
  'VAU1T7S5UuEHmMvXtXMVmpEoQtZ2ya7eRb7gcN47wDp'
);
export const ammPid = new PublicKey(
  'AMM5G2nxuKUwCLRYTW7qqEwuoqCtNSjtbipwEmm2g8bH'
);
