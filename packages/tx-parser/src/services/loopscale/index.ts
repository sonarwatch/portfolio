import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Loopscale',
  address: '1oopBoJG58DgkUVKkEzKgyG9dvRmpgeEm1AVjoHkF78',
  platformId: 'loopscale',
};

const service: Service = {
  id: 'loopscale',
  name: 'Loopscale',
  platformId: 'loopscale',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
