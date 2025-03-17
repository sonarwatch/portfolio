import { Contract, NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'jupiter-exchange';

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

export const services: Service[] = [
  {
    id: `${platformId}-swap`,
    name: 'Swap',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterSwapContract],
  },
  {
    id: `${platformId}-limitv1`,
    name: 'Limit v1',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterLimitV1Contract],
  },
  {
    id: `${platformId}-limit`,
    name: 'Limit',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterLimitContract],
  },
  {
    id: `${platformId}-dca`,
    name: 'DCA',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterDcaContract],
  },
  {
    id: `${platformId}-dcava`,
    name: 'DCA VA',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterDcaVaContract],
  },
  {
    id: `${platformId}-lock`,
    name: 'Lock',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterLockContract],
  },
  {
    id: `${platformId}-perps`,
    name: 'Perps',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterPerpsContract],
  },
];
export default services;
