import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const defiTunaContract = {
  name: 'DefiTuna',
  address: 'tuna4uSQZncNeeiAMKbstuxA9CUkHH6HmC64wgmnogD',
  platformId: 'defituna',
};
export const defiTunaService: Service = {
  id: 'defituna',
  name: 'Lending',
  platformId: 'defituna',
  networkId: NetworkId.solana,
  contracts: [defiTunaContract],
};

export const services: Service[] = [defiTunaService];
export default services;
