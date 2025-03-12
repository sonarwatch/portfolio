import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'texture';
export const platform: Platform = {
  id: platformId,
  name: 'Texture',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/texture.webp',
  website: 'https://texture.finance',
  twitter: 'https://twitter.com/texture_fi',
  discord: 'https://discord.gg/6YvjpXzsqp',
  documentation: 'https://texture.gitbook.io/texture',
  telegram: 'https://t.me/+R9Ah7VZVfspjODky',
  github: 'https://github.com/texture-finance',
  description: "Solana's New Age Modular Lending Platform",
};

export const pid = new PublicKey('MLENdNkmK61mGd4Go8BJX9PhYPN3azrAKRQsAC7u55v');
