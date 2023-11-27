import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const jupiterPlatform: Platform = {
  id: 'jupiter',
  name: 'Jupiter',
  image: 'https://sonar.watch/img/platforms/jupiter.png',
  defiLlamaId: 'jupiter-aggregator',
  website: 'https://jup.ag/',
};

export const limitProgramId = new PublicKey(
  'jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu'
);

export const dcaProgramId = new PublicKey(
  'DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M'
);
