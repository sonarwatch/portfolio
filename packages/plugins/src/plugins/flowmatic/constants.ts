import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'flowmatic';
export const platform: Platform = {
  id: platformId,
  name: 'Flowmatic',
  image: 'https://sonar.watch/img/platforms/flowmatic.png',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://www.flowmatic.xyz/',
  twitter: 'https://twitter.com/FlowmaticXYZ',
};

export const programId = new PublicKey(
  'STAKEGztX7S1MUHxcQHieZhELCntb9Ys9BgUbeEtMu1'
);

export const flowmaticMint = 'Eh1fXbAipe4k7CYR9UMb2bbWmBcpU3HcyX3LWuRVFBLz';
