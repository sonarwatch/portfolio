import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'triad';
export const platform: Platform = {
  id: platformId,
  name: 'Triad',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/triad.webp',
  website: 'https://app.triadfi.co/',
  twitter: 'https://x.com/triadfi',
  documentation: 'https://docs.triadfi.co/',
  telegram: 'https://t.me/triad369',
  github: 'https://github.com/triadxyz',
  discord: 'http://discord.gg/triadfi',
  description:
    'Prediction markets on Solana. Trade politics, crypto, sports & culture.',
  tokens: ['t3DohmswhKk94PPbPYwA6ZKACyY3y5kbcqeQerAJjmV'],
};

export const programId = new PublicKey(
  'TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss'
);

export const marketsCacheKey = 'markets';
