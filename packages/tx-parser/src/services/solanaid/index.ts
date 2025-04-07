import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Staking',
  address: 'gp8fqiE5cwX3JRT8unpKeFutNdMihyisAe3nx6L3S1p',
  platformId: 'solanaid',
};

const service: Service = {
  id: 'solanaid',
  name: 'Staking',
  platformId: 'solanaid',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
