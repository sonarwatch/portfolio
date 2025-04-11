import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'nirvana';
const contract = {
  name: 'Borrow & Governance',
  address: 'NirvHuZvrm2zSxjkBvSbaF2tHfP5j7cvMj9QmdoHVwb',
  platformId,
};

export const services: Service[] = [
  {
    id: platformId,
    name: 'Borrow & Governance',
    platformId,
    networkId: NetworkId.solana,
    contracts: [contract],
  },
];
export default services;
