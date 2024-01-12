import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'parcl';
export const platform: Platform = {
  id: platformId,
  name: 'Parcl',
  image: 'https://sonar.watch/img/platforms/parcl.png',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  // website: 'https://myplatform.com',
  // twitter: 'https://twitter.com/myplatform',
};

export const programId = new PublicKey(
  '3parcLrT7WnXAcyPfkCz49oofuuf2guUKkjuFkAhZW8Y'
);
