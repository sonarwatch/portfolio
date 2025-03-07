import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'ratex';
export const platform: Platform = {
  id: platformId,
  name: 'RateX',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/ratex.webp',
  website: 'https://rate-x.io/',
  twitter: 'https://x.com/RateX_Dex',
  defiLlamaId: 'ratex',
  github: 'https://github.com/RateX-Protocol',
  telegram: 'https://t.me/RateXofficial',
  discord: 'https://discord.com/invite/ratex',
  documentation: 'https://docs.rate-x.io/ratex',
  description:
    'RateX Protocol is a decentralized exchange (DEX) built on Solana, specializing in leveraged yield trading.',
};

export const programIdLookupTable = new PublicKey(
  'Es56bH1dokFwohpWS8XYSfTXavvSEuyob2FnUYzF6pCL'
);

export const programsCacheKey = 'programs';
export const poolPrefix = `${platformId}-pool`;
