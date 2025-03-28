import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'orca';
export const platform: Platform = {
  id: platformId,
  name: 'Orca',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/orca.webp',
  defiLlamaId: 'orca',
  website: 'https://www.orca.so/',
  discord: 'https://discord.orca.so/',
  github: 'https://github.com/orca-so',
  twitter: 'https://twitter.com/orca_so',
  medium: 'https://orca-so.medium.com/',
  documentation: 'https://docs.orca.so/',
  tokens: ['orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE'],
  description:
    'Orca is the go-to place to trade tokens and provide liquidity on Solana',
};

export const orcaStakingPlatformId = 'orca-staking';
export const orcaStakingPlatform: Platform = {
  id: orcaStakingPlatformId,
  name: 'Orca Staking',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/orca.webp',
  website: 'https://v1.orca.so/staking',
};

export const poolsProgram = new PublicKey(
  '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP'
);
export const aquafarmsProgram = new PublicKey(
  '82yxjeMsvaURa4MbZZ7WZZHfobirZYkH1zF8fmeGtyaQ'
);
export const whirlpoolProgram = new PublicKey(
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc'
);

export const positionsIdentifiers = ['Orca Whirlpool Position', 'OWP'];
export const whirlpoolPrefix = `${platformId}-whirlpool`;
