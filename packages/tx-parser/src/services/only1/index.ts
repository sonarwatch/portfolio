import { Contract, NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'only1';

const aggregatorContract: Contract = {
  name: `Service`,
  address: 'CDfyUBS8ZuL1L3kEy6mHVyAx1s9E97KNAwTfMfvhCriN',
  platformId,
};

export const services: ServiceDefinition[] = [
  {
    id: `${platformId}-service`,
    name: 'Service',
    platformId,
    networkId: NetworkId.solana,
    contracts: [aggregatorContract],
  },
];
export default services;
