import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'nirvana';
const contract = {
  name: 'Borrow & Governance',
  address: 'NirvHuZvrm2zSxjkBvSbaF2tHfP5j7cvMj9QmdoHVwb',
  platformId,
};

export const services: ServiceDefinition[] = [
  {
    id: platformId,
    name: 'Borrow & Governance',
    platformId,
    networkId: NetworkId.solana,
    contracts: [contract],
  },
];
export default services;
