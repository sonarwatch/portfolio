import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'vaultka';
export const platform: Platform = {
  id: platformId,
  name: 'Vaultka',
  image: 'https://sonar.watch/img/platforms/vaultka.webp',
  website: 'https://solana.vaultka.com/',
  twitter: 'https://x.com/Vaultkaofficial',
  defiLlamaId: 'vaultka', // from https://defillama.com/docs/api
};

export const lendingsCacheKey = `lendings`;

export const lendingProgramIds = [
  new PublicKey('DE7BUY3Fa4CRc44RxRDpcknbCT6mYTY3LpZNFET7k3Hz'),
  new PublicKey('DMhoXyVNpCFeCEfEjEQfS6gzAEcPUUSXM8Xnd2UXJfiS'),
  new PublicKey('nKMLJtN1rr64K9DjmfzXvzaq4JEy5a4AJHHP9gY1dW6'),
  new PublicKey('69oX4gmwgDAfXWxSRtTx9SHvWmu2bd9qVGjQPpAFHaBF'),
];
