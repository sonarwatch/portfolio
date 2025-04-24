import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'nosana';
const contract = {
  name: 'Staking',
  address: 'nosScmHY2uR24Zh751PmGj9ww9QRNHewh9H59AfrTJE',
  platformId,
};

export const services: Service[] = [
  {
    id: `${platformId}-staking`,
    name: 'Staking',
    platformId,
    networkId: NetworkId.solana,
    contracts: [contract],
  },
];
export default services;
