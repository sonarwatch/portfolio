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

export const strategiesCacheKey = `strategies`;

export const strategies = [
  '6UBsNdYq3MEao1m9NXQD1VEmXvptUXhfMwdHANGAo4bs',
  'B3FS1X2PZPBrtBZiyAN9oqABnu3o5YWwdY5ioqoVh64P',
  'SkFLfp7eSRsan13dEUZSVzMBj3vdyZnhaasFKQTzuiE',
  '6VwarrrqWVWAmZtNdgGafeyoXD3SsspKxuxkZVarZqTA',
  '9p5Sc5SvR8QpJCQV3U4q6zVUTupr4Tr9Jmf48sbcSjtX',
  'FRyGij76xTvAg1nPPTaXHfa3QxUfZuKARuAyAaMyoLPo',
  'A7PDwCJ3qcdVoZLqq7wHAwMq9yEKZU2vFx7Y9qbZ1dKJ',
];
