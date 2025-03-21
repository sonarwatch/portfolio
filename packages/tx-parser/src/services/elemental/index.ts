import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Elemental',
  address: 'ELE5vYY81W7UCpTPs7SyD6Bwm5FwZBntTW8PiGqM5d4A',
  platformId: 'elemental',
};

export const service: Service = {
  id: 'elemental',
  name: 'Elemental',
  platformId: 'elemental',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
