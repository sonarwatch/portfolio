import { Contract, NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'raydium';

const raydiumAmmV3Contract: Contract = {
  name: 'Raydium AMM v3',
  address: 'EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q',
  platformId,
};
const raydiumAmmV4Contract: Contract = {
  name: 'Raydium AMM v4',
  address: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
  platformId,
};
const raydiumAmmV5Contract: Contract = {
  name: 'Raydium AMM v5',
  address: '5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h',
  platformId,
};
const raydiumClmmContract: Contract = {
  name: 'Raydium CLMM',
  address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
  platformId,
};
const raydiumCpmmContract: Contract = {
  name: 'Raydium CPMM',
  address: 'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C',
  platformId,
};

export const services: Service[] = [
  {
    id: `${platformId}-amm-v3`,
    name: 'AMM v3',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumAmmV3Contract],
  },
  {
    id: `${platformId}-amm-v4`,
    name: 'AMM v4',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumAmmV4Contract],
  },
  {
    id: `${platformId}-amm-v5`,
    name: 'AMM v5',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumAmmV5Contract],
  },
  {
    id: `${platformId}-clmm`,
    name: 'CLMM',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumClmmContract],
  },
  {
    id: `${platformId}-cpmm`,
    name: 'CPMM',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumCpmmContract],
  },
];

export default services;
