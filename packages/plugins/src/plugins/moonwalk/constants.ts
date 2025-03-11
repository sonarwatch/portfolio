import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'moonwalk';
export const platform: Platform = {
  id: platformId,
  name: 'Moonwalk',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/moonwalk.webp',
  website: 'https://app.moonwalk.fit/',
  twitter: 'https://twitter.com/moonwalkfitness',
  discord: 'https://discord.com/invite/jBhgHWUJ9U',
  telegram: 'https://t.me/+x0hEQqQP1GpjZGZh',
  description: 'Gamify your Fitness Journey',
  documentation: 'https://moonwalk.fit/faq',
};
export const gamesCacheId = `games`;
export const programId = new PublicKey(
  'FitAFk15vtx2PBjfr7QTnefaHRx6HwajRiZMt1DdSSKU'
);

export const newApi = 'https://data.moonwalk.fit/api/v1/users/tokens/';
