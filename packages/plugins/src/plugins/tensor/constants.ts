import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const tnsrMint = 'TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6';
export const platformId = 'tensor';
export const platform: Platform = {
  id: platformId,
  name: 'Tensor',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/tensor.webp',
  twitter: 'https://twitter.com/tensor_hq',
  website: 'https://www.tensor.trade/',
  tokens: [tnsrMint],
  documentation: 'https://docs.tensor.trade/',
  discord: 'https://discord.gg/tensor',
  github: 'https://github.com/tensor-hq',
  description: "Solana's Leading NFT Marketplace",
};

export const tensorPid = new PublicKey(
  'TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'
);

export const magmaProgramId = '3zK38YBP6u3BpLUpaa6QhRHh4VXdv3J8cmD24fFpuyqy';

export const s4Statics: AirdropStatics = {
  claimStart: 1738281600000,
  claimEnd: 1753963200000,
  id: 'tensor-s4',
  emitterName: 'Tensor',
  emitterLink: 'https://www.tensor.trade/',
  claimLink: 'https://tensor.foundation/season4',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/tensor.webp',
};

export const powerUsersStatics: AirdropStatics = {
  claimStart: 1730851200000,
  claimEnd: 1746489600000,
  id: 'tensor-power-user',
  emitterName: 'Tensor',
  emitterLink: 'https://www.tensor.trade/',
  claimLink: 'https://www.tensor.foundation/powerusers',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/tensor.webp',
};
