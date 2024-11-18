import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'tensor';
export const platform: Platform = {
  id: platformId,
  name: 'Tensor',
  image: 'https://sonar.watch/img/platforms/tensor.webp',
  twitter: 'https://twitter.com/tensor_hq',
  website: 'https://www.tensor.trade/',
};

export const tensorPid = new PublicKey(
  'TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'
);

export const tnsrMint = 'TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6';

export const magmaProgramId = '3zK38YBP6u3BpLUpaa6QhRHh4VXdv3J8cmD24fFpuyqy';
