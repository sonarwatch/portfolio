import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const wMint = '85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ';
export const platformId = 'wormhole';
export const platform: Platform = {
  id: platformId,
  name: 'Wormhole',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/wormhole.webp',
  website: 'https://w.wormhole.com/',
  twitter: 'https://twitter.com/wormhole',
  discord: 'https://discord.com/invite/wormholecrypto',
  telegram: 'https://t.me/wormholecrypto',
  github: 'https://github.com/wormhole-foundation',
  documentation: 'https://wormhole.com/docs/',
  description:
    'Future-proof, permissionless tooling to empower multichain builders',
  tokens: [wMint],
};

export const apiUrl = 'https://prod-flat-files-min.wormhole.com/';

export const stakingProgramId = new PublicKey(
  'sspu65omPW2zJGWDxmx8btqxudHezoQHSGZmnW8jbVz'
);
