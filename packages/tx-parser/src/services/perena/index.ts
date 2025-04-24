import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Perena',
  address: 'NUMERUNsFCP3kuNmWZuXtm1AaQCPj9uw6Guv2Ekoi5P',
  platformId: 'perena',
};

const service: Service = {
  id: 'perena',
  name: 'Numéraire',
  platformId: 'perena',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
