import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'wormhole';
const contract = {
  name: 'Staking',
  address: 'sspu65omPW2zJGWDxmx8btqxudHezoQHSGZmnW8jbVz',
  platformId,
};

const service: Service = {
  id: `${platformId}-governance`,
  name: 'Governance',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
