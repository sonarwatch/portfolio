import { Contract, NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'jupiter-exchange';

export const jupiterV6Contract: Contract = {
  name: 'Swap',
  address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
  platformId,
};
const jupiterV5Contract = {
  name: 'Swap v5',
  address: 'JUP5pEAZeHdHrLxh5UCwAbpjGwYKKoquCpda2hfP4u8',
  platformId,
};
const jupiterV4Contract = {
  name: 'Swap v4',
  address: 'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB',
  platformId,
};
const jupiterV3Contract = {
  name: 'Swap v3',
  address: 'JUP3c2Uh3WA4Ng34tw6kPd2G4C5BB21Xo36Je1s32Ph',
  platformId,
};
const jupiterV2Contract = {
  name: 'Swap v2',
  address: 'JUP2jxvXaqu7NQY1GmNF4m1vodw12LVXYxbFL2uJvfo',
  platformId,
};
const jupiterLimitV1Contract: Contract = {
  name: 'Limit v1',
  address: 'jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu',
  platformId,
};
const jupiterLimitContract: Contract = {
  name: 'Limit',
  address: 'j1o2qRpjcyUwEvwtcfhEQefh773ZgjxcVRry7LDqg5X',
  platformId,
};
const jupiterDcaContract: Contract = {
  name: 'DCA',
  address: 'DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M',
  platformId,
};
const jupiterDcaVaContract: Contract = {
  name: 'VA',
  address: 'VALaaymxQh2mNy2trH9jUqHT1mTow76wpTcGmSWSwJe',
  platformId,
};
const jupiterLockContract: Contract = {
  name: 'Lock',
  address: 'LocpQgucEQHbqNABEYvBvwoxCPsSbG91A1QaQhQQqjn',
  platformId,
};
const jupiterPerpsContract: Contract = {
  name: 'Perps',
  address: 'PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu',
  platformId,
};
const jupiterJupuaryContract: Contract = {
  name: 'Jupuary',
  address: 'DiS3nNjFVMieMgmiQFm6wgJL7nevk4NrhXKLbtEH1Z2R',
  platformId,
};
const jupiterGovernanceContract: Contract = {
  name: 'Governance',
  address: 'GovaE4iu227srtG2s3tZzB4RmWBzw8sTwrCLZz7kN7rY',
  platformId,
};
const jupiterVoteContract: Contract = {
  name: 'Vote',
  address: 'voTpe3tHQ7AjQHMapgSue2HJFAh2cGsdokqN3XqmVSj',
  platformId,
};
const rfqContract: Contract = {
  name: 'JupiterZ',
  address: '61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH',
  platformId,
};
const inviteContract: Contract = {
  name: 'Invite',
  address: 'inv1tEtSwRMtM44tbvJGNiTxMvDfPVnX9StyqXfDfks',
  platformId,
};

export const services: Service[] = [
  {
    id: `${platformId}-swap`,
    name: 'Swap',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterV6Contract],
  },
  {
    id: `${platformId}-swap-v5`,
    name: 'Swap v5',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterV5Contract],
  },
  {
    id: `${platformId}-swap-v4`,
    name: 'Swap v4',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterV4Contract],
  },
  {
    id: `${platformId}-swap-v3`,
    name: 'Swap v3',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterV3Contract],
  },
  {
    id: `${platformId}-swap-v2`,
    name: 'Swap v2',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterV2Contract],
  },
  {
    id: `${platformId}-jupiter-z`,
    name: 'JupiterZ',
    platformId,
    networkId: NetworkId.solana,
    contracts: [rfqContract],
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
    id: `${platformId}-dca-swap`,
    name: 'DCA',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterDcaContract, jupiterV6Contract],
  },
  {
    id: `${platformId}-dca-deposit`,
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
  {
    id: `${platformId}-jupuary`,
    name: 'Jupuary',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterJupuaryContract],
  },
  {
    id: `${platformId}-governance`,
    name: 'Governance',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterGovernanceContract],
  },
  {
    id: `${platformId}-vote`,
    name: 'Vote',
    platformId,
    networkId: NetworkId.solana,
    contracts: [jupiterVoteContract],
  },
  {
    id: `${platformId}-invite`,
    name: 'Invite',
    platformId,
    networkId: NetworkId.solana,
    contracts: [inviteContract],
  },
];
export default services;
