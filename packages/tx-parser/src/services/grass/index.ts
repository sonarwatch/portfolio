import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'grass';
const contract = {
  name: 'Staking',
  address: 'EyxPPowqBRTpZpiDb2ixUR6XUU1VJwTCNgJdK8eyc6kc',
  platformId,
};

const service: Service = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
