import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'phoenix';
const contract = {
  name: 'Market',
  address: 'PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY',
  platformId,
};

export const services: ServiceDefinition[] = [
  {
    id: 'phoenix-market',
    name: 'Market',
    platformId,
    networkId: NetworkId.solana,
    contracts: [contract],
  },
];
export default services;
