import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Drift',
  address: 'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH',
  platformId: 'drift',
};
const service: Service = {
  id: 'drift',
  name: 'Perps',
  platformId: 'drift',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
