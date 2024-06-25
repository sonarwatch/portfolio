import { PublicKey } from '@solana/web3.js';

import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'jupiter-exchange';
export const platform: Platform = {
  id: platformId,
  name: 'Jupiter Exchange',
  image: 'https://sonar.watch/img/platforms/jupiter.png',
  defiLlamaId: 'parent#jupiter',
  website: 'https://jup.ag/',
  twitter: 'https://twitter.com/JupiterExchange',
};

export const perpsProgramId = new PublicKey(
  'PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu'
);
export const valueAverageProgramId = new PublicKey(
  'JVAp1DSLnM4Qh8qM1QasQ8x56ccb9S3DhbyEckybTF9'
);
export const limitProgramId = new PublicKey(
  'jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu'
);
export const limitV2ProgramId = new PublicKey(
  'j1o2qRpjcyUwEvwtcfhEQefh773ZgjxcVRry7LDqg5X'
);
export const dcaProgramId = new PublicKey(
  'DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M'
);

export const jlpPool = new PublicKey(
  '5BUwFW4nRbftYTDMbgxykoFWqWHPzahFSNAaaaJtVKsq'
);
export const jlpToken = new PublicKey(
  '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4'
);
export const custodiesKey = 'custodies';
export const perpPoolsKey = 'perppools';
