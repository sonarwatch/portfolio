import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'staratlas';
export const atlasMint = 'ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx';
export const polisMint = 'poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk';
export const platform: Platform = {
  id: platformId,
  name: 'Star Atlas',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/staratlas.webp',
  website: 'https://staratlas.com/',
  twitter: 'https://twitter.com/staratlas',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  tokens: [atlasMint, polisMint],
  discord: 'https://discord.com/invite/StarAtlas',
  telegram: 'https://t.me/staratlasgame',
  github: 'https://github.com/staratlasmeta',
  documentation: 'https://staratlas.com/newsroom/game-manuals',
  description:
    'A grand strategy game of space exploration, territorial conquest, political domination, and more.',
};

export const lockerAddress = new PublicKey(
  '5WmM9c9WE71y78Ah8Bp8vgyoStscM1ZZyaaFqRf8b2Qa'
);
export const stakingPid = new PublicKey(
  'ATLocKpzDbTokxgvnLew3d7drZkEzLzDpzwgrgWKDbmc'
);
export const proxyRewarderPid = new PublicKey(
  'gateVwTnKyFrE8nxUUgfzoZTPKgJQZUbLsEidpG4Dp2'
);
export const lockedVoterPid = new PublicKey(
  'Lock7kBijGCQLEFAmXcengzXKA88iDNQPriQ7TbgeyG'
);
export const polisDecimals = 8;
export const atlasDecimals = 8;
