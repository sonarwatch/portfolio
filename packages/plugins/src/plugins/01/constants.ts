import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { usdcSolanaMint } from '../../utils/solana';
import { mSOLMint } from '../marinade/constants';

export const platformId = '01';
export const platform: Platform = {
  id: platformId,
  name: '01',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/01.webp',
  defiLlamaId: '01', // from https://defillama.com/docs/api
  website: 'https://01-prod-git-main-monkeylanding.vercel.app/',
  twitter: 'https://x.com/01_exchange',
  discord: 'https://discord.gg/JZwrrgMhGT',
  documentation: 'https://01.xyz/docs',
  isDeprecated: true,
  description:
    '01 Exchange is a next-gen trading experience with the speed of centralized exchanges and the integrity of decentralized finance, powered by Nord Engine.',
};

export const programId = new PublicKey(
  'Zo1ggzTUKMY5bYnDvT5mtVeZxzf2FaLTbKkmvGUhUQk'
);

export const mints = [
  usdcSolanaMint,
  'So11111111111111111111111111111111111111112',
  '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk',
  '9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i',
  mSOLMint,
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
];
