import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'lifinity';
export const platform: Platform = {
  id: platformId,
  name: 'Lifinity',
  image: 'https://sonar.watch/img/platforms/lifinity.webp',
  defiLlamaId: 'parent#lifinity', // from https://defillama.com/docs/api
  website: 'https://ido.lifinity.io/rewards',
  // twitter: 'https://twitter.com/myplatform',
};

export const LifinityLockerProgramId = new PublicKey(
  'LLoc8JX5dLAMVzbzTNKG6EFpkyJ9XCsVAGkqwQKUJoa'
);

export const rewarder = new PublicKey(
  'LRewdYDnxyP9HXCL6DQYgTaeL9FKb5Pc8Gr4UbVrtnj'
);

export const lfntyDecimals = 6;
export const lfntyMint = 'LFNTYraetVioAPnGJht4yNg2aUZFXR776cMeN9VMjXp';
export const xLfntyDecimals = 6;
export const xLfntyMint = 'xLfNTYy76B8Tiix3hA51Jyvc1kMSFV4sPdR7szTZsRu';
