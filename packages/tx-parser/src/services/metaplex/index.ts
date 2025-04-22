import { Contract, NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'metaplex';

const bubblegumContract: Contract = {
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
];

export default services;
