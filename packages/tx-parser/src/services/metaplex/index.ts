import { Contract, NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'metaplex';

export const metaplexContract: Contract = {
  name: `Token Metadata`,
  address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  platformId,
};

export const bubblegumContract: Contract = {
  name: `Bubblegum (cNFT)`,
  address: 'BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY',
  platformId,
};

export const services: Service[] = [
  {
    id: `${platformId}-cnft`,
    name: 'Bubblegum (cNFT)',
    platformId,
    networkId: NetworkId.solana,
    contracts: [bubblegumContract],
  },
  {
    id: `${platformId}-metadata`,
    name: 'Token Metadata',
    platformId,
    networkId: NetworkId.solana,
    contracts: [metaplexContract],
  },
];

export default services;
