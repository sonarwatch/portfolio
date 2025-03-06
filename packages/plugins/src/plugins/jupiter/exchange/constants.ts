import { PublicKey } from '@solana/web3.js';

import {
  Contract,
  NetworkId,
  Platform,
  Service,
} from '@sonarwatch/portfolio-core';

export const platformId = 'jupiter-exchange';
export const platform: Platform = {
  id: platformId,
  name: 'Jupiter Exchange',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/jupiter.webp',
  defiLlamaId: 'parent#jupiter',
  website: 'https://jup.ag/',
  twitter: 'https://twitter.com/JupiterExchange',
};

export const jupiterSwapContract: Contract = {
  name: 'Jupiter Swap',
  address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
  platformId,
};
const jupiterLimitV1Contract: Contract = {
  name: 'Jupiter Limit v1',
  address: 'jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu',
  platformId,
};
const jupiterLimitContract: Contract = {
  name: 'Jupiter Limit',
  address: 'j1o2qRpjcyUwEvwtcfhEQefh773ZgjxcVRry7LDqg5X',
  platformId,
};
const jupiterDcaContract: Contract = {
  name: 'Jupiter DCA',
  address: 'DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M',
  platformId,
};
const jupiterDcaVaContract: Contract = {
  name: 'Jupiter DCA VA',
  address: 'VALaaymxQh2mNy2trH9jUqHT1mTow76wpTcGmSWSwJe',
  platformId,
};
const jupiterLockContract: Contract = {
  name: 'Jupiter Lock',
  address: 'LocpQgucEQHbqNABEYvBvwoxCPsSbG91A1QaQhQQqjn',
  platformId,
};
const jupiterPerpsContract: Contract = {
  name: 'Jupiter Perps',
  address: 'PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu',
  platformId,
};

export const perpsProgramId = new PublicKey(jupiterPerpsContract.address);
export const valueAverageProgramId = new PublicKey(
  jupiterDcaVaContract.address
);
export const limitV1ProgramId = new PublicKey(jupiterLimitV1Contract.address);
export const limitV2ProgramId = new PublicKey(jupiterLimitContract.address);
export const dcaProgramId = new PublicKey(jupiterDcaContract.address);
export const lockProgramId = new PublicKey(jupiterLockContract.address);

export const jlpPool = new PublicKey(
  '5BUwFW4nRbftYTDMbgxykoFWqWHPzahFSNAaaaJtVKsq'
);
export const jlpToken = new PublicKey(
  '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4'
);
export const custodiesKey = 'custodies';
export const perpPoolsKey = 'perppools';

export const pluginServices: Service[] = [
  {
    id: `${platformId}-swap`,
    name: 'Swap',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterSwapContract],
  },
  {
    id: `${platformId}-swap`,
    name: 'Limit v1',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterLimitV1Contract],
  },
  {
    id: `${platformId}-swap`,
    name: 'Limit',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterLimitContract],
  },
  {
    id: `${platformId}-swap`,
    name: 'DCA',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterDcaContract],
  },
  {
    id: `${platformId}-swap`,
    name: 'DCA VA',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterDcaVaContract],
  },
  {
    id: `${platformId}-swap`,
    name: 'Lock',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterLockContract],
  },
  {
    id: `${platformId}-swap`,
    name: 'Perps',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterPerpsContract],
  },
];
