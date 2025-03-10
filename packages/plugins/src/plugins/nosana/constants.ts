import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'nosana';
export const platform: Platform = {
  id: platformId,
  name: 'Nosana',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/nosana.webp',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://app.nosana.io/',
  twitter: 'https://x.com/nosana_ai',
  github: 'https://github.com/nosana-ci',
  discord: 'http://discord.gg/nosana-ai',
  telegram: 'http://t.me/NosanaCompute',
  description:
    'Nosana is your go-to GPU marketplace for AI inference. Save up to 6x on compute costs and scale your AI workloads effortlessly.',
  documentation: 'https://docs.nosana.com/',
};

export const nosMint = 'nosXBVoaCTtYdLvKY6Csb4AC8JCdQKKAaWYtx2ZMoo7';
export const nosDecimals = 6;
export const nosanaStakingPid = new PublicKey(
  'nosScmHY2uR24Zh751PmGj9ww9QRNHewh9H59AfrTJE'
);
