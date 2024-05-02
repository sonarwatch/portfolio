import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'tensor';
export const platform: Platform = {
  id: platformId,
  name: 'Tensor',
  image: 'https://sonar.watch/img/platforms/tensor.png',
  twitter: 'https://twitter.com/tensor_hq',
  website: 'https://www.tensor.trade/',
};
export const cachePrefix = 'tensor';

export const tensorPid = new PublicKey(
  'TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'
);

export const locksPid = new PublicKey(
  'TLoCKic2wGJm7VhZKumih4Lc35fUhYqVMgA4j389Buk'
);
export const tnsrMint = 'TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6';
export const tnsrDecimals = 9;
