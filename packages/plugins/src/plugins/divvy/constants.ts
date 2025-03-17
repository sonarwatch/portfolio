import { Platform } from '@sonarwatch/portfolio-core';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { PublicKey } from '@solana/web3.js';
import { DivvyIdl } from './idl';

export const platformId = 'divvy';
export const dvyMint = '8fdi18UQNGg8mFEzjf79GUkzTg9YHSeojzCcarVxCX2y';
export const platform: Platform = {
  id: platformId,
  name: 'Divvy',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/divvy.webp',
  defiLlamaId: 'divvy.bet',
  website: 'https://app.divvy.bet/',
  discord: 'https://discord.com/invite/divvybet',
  documentation:
    'https://divvy.bet/wp-content/uploads/2022/12/Divvy_Knowledge_Hub_06.pdf',
  twitter: 'https://twitter.com/DivvyBet',
  tokens: [dvyMint],
  description:
    'Frictionless betting experience powered by Solana with no signups or deposits',
};

export const divvyProgram = new PublicKey(
  'dvyFwAPniptQNb1ey4eM12L8iLHrzdiDsPPDndd6xAR'
);

export const divvyIdlItem = {
  programId: divvyProgram.toString(),
  idl: DivvyIdl,
  idlType: 'anchor',
} as IdlItem;

export const houseCacheKey = 'houses';
