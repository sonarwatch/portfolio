import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'lifinity';
export const xLfntyMint = 'xLfNTYy76B8Tiix3hA51Jyvc1kMSFV4sPdR7szTZsRu';
export const lfntyMint = 'LFNTYraetVioAPnGJht4yNg2aUZFXR776cMeN9VMjXp';
export const platform: Platform = {
  id: platformId,
  name: 'Lifinity',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/lifinity.webp',
  defiLlamaId: 'parent#lifinity', // from https://defillama.com/docs/api
  website: 'https://ido.lifinity.io/rewards',
  twitter: 'https://x.com/Lifinity_io',
  documentation: 'https://docs.lifinity.io/',
  medium: 'https://medium.com/@lifinity.io',
  discord: 'http://discord.gg/K2tvfcXwWr',
  github: 'https://github.com/Lifinity-Labs',
  tokens: [lfntyMint, xLfntyMint],
  description:
    "Solana's oracle-based DEX, designed to improve capital efficiency and reverse impermanent loss.",
};

export const LifinityLockerProgramId = new PublicKey(
  'LLoc8JX5dLAMVzbzTNKG6EFpkyJ9XCsVAGkqwQKUJoa'
);

export const rewarder = new PublicKey(
  'LRewdYDnxyP9HXCL6DQYgTaeL9FKb5Pc8Gr4UbVrtnj'
);

export const lfntyDecimals = 6;
export const xLfntyDecimals = 6;
