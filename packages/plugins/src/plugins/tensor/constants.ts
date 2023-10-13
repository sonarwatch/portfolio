import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'tensor';
export const tensorPlatform: Platform = {
  id: platformId,
  name: 'Tensor',
  image: 'https://alpha.sonar.watch/img/platforms/tensor.png',
  twitter: 'https://twitter.com/tensor_hq',
  website: 'https://www.tensor.trade/',
};
export const cachePrefix = 'tensor';

export const tensorProgram = new PublicKey(
  'TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'
);
