import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'phoenix';
const contract = {
  name: 'Market',
  address: 'PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY',
  platformId,
};

export const services: Service[] = [
  {
    id: 'phoenix-market',
    name: 'Market',
    platformId,
    networkId: NetworkId.solana,
    contracts: [contract],
  },
];
export default services;
