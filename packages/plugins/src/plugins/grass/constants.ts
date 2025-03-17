import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'grass';
export const grassMint = 'Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs';
export const platform: Platform = {
  id: platformId,
  name: 'Grass',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/grass.webp',
  website: 'https://www.grassfoundation.io/stake',
  twitter: 'https://twitter.com/getgrass_io',
  documentation: 'https://grass-foundation.gitbook.io/grass-docs',
  discord: 'https://discord.com/invite/getgrass',
  description: 'Get rewarded for your unused internet',
  tokens: [grassMint],
};

export const airdropStatics: AirdropStatics = {
  claimLink: 'https://www.grassfoundation.io/claim',
  emitterLink: 'https://www.grassfoundation.io/',
  emitterName: platform.name,
  id: 'grass-airdrop',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/grass.webp',
  claimEnd: undefined,
  claimStart: 1730073600000,
};

export const airdropApi = 'https://api.getgrass.io/airdropAllocations?input=';
export const pidDistributor = new PublicKey(
  'Eohp5jrnGQgP74oD7ij9EuCSYnQDLLHgsuAmtSTuxABk'
);
export const pid = new PublicKey(
  'EyxPPowqBRTpZpiDb2ixUR6XUU1VJwTCNgJdK8eyc6kc'
);
