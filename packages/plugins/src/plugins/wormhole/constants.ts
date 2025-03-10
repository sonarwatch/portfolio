import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'wormhole';
export const platform: Platform = {
  id: platformId,
  name: 'Wormhole',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/wormhole.webp',
  website: 'https://w.wormhole.com/',
  twitter: 'https://twitter.com/wormhole',
};

export const apiUrl = 'https://prod-flat-files-min.wormhole.com/';
export const wMint = '85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ';

export const stakingProgramId = new PublicKey(
  'sspu65omPW2zJGWDxmx8btqxudHezoQHSGZmnW8jbVz'
);
