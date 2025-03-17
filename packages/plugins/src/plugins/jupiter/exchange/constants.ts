import { PublicKey } from '@solana/web3.js';

import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'jupiter-exchange';
export const jlpToken = new PublicKey(
  '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4'
);
export const jupSOLMint = 'jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v';
export const platform: Platform = {
  id: platformId,
  name: 'Jupiter Exchange',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/jupiter.webp',
  defiLlamaId: 'parent#jupiter',
  website: 'https://jup.ag/',
  twitter: 'https://twitter.com/JupiterExchange',
  discord: 'https://discord.gg/jup',
  documentation: 'https://station.jup.ag/',
  github: 'https://github.com/jup-ag',
  tokens: [jlpToken.toString(), jupSOLMint],
  description:
    'The best decentralized liquidity platform, largest DAO & best community in crypto.',
};

export const perpsProgramId = new PublicKey(
  'PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu'
);
export const valueAverageProgramId = new PublicKey(
  'VALaaymxQh2mNy2trH9jUqHT1mTow76wpTcGmSWSwJe'
);
export const limitV1ProgramId = new PublicKey(
  'jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu'
);
export const limitV2ProgramId = new PublicKey(
  'j1o2qRpjcyUwEvwtcfhEQefh773ZgjxcVRry7LDqg5X'
);
export const dcaProgramId = new PublicKey(
  'DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M'
);
export const lockProgramId = new PublicKey(
  'LocpQgucEQHbqNABEYvBvwoxCPsSbG91A1QaQhQQqjn'
);

export const jlpPool = new PublicKey(
  '5BUwFW4nRbftYTDMbgxykoFWqWHPzahFSNAaaaJtVKsq'
);

export const custodiesKey = 'custodies';
export const perpPoolsKey = 'perppools';
