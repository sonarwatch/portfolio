import { Platform } from '@sonarwatch/portfolio-core';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { PublicKey } from '@solana/web3.js';
import { restakingIdl } from './idl';

export const platformId = 'picasso';
export const platform: Platform = {
  id: platformId,
  name: 'Picasso',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/picasso.webp',
  website: 'https://app.picasso.network/solana-staking/',
  twitter: 'https://x.com/picasso_network',
  // defiLlamaId: 'composable-finance', // from https://defillama.com/docs/api
  discord: 'https://discord.com/invite/composable',
  telegram: 'https://t.me/composablechat',
  github: 'https://github.com/ComposableFi',
  documentation: 'https://docs.picasso.network/',
  medium: 'https://medium.com/@Picasso_Network',
  tokens: ['966vsqwoS3ZBrHesTyAvE7esFV2kaHaDFLLXs4asPdLJ'],
  description:
    'Picasso L1 Protocol enables secure bridging and multi-asset restaking through cross-chain Inter-Blockchain-Communication (IBC).',
};

export const unstakingNftsCacheKey = `unstaking-nfts`;
export const unstakingNftsCachePrefix = `${platformId}`;

export const restakingProgramId = new PublicKey(
  '8n3FHwYxFgQCQc2FNFkwDUf9mcqupxXcCvgfHbApMLv3'
);

export const unstakingOwner = 'BoNnRkatYrN7ckA9oAU4e7cHYfwKPgLEuzkKg4LWaHeH';

export const restakingIdlItem = {
  programId: restakingProgramId.toString(),
  idl: restakingIdl,
  idlType: 'anchor',
} as IdlItem;
