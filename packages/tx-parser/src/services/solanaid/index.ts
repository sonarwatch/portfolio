import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Staking',
  address: 'gp8fqiE5cwX3JRT8unpKeFutNdMihyisAe3nx6L3S1p',
  platformId: 'solanaid',
};

const service: ServiceDefinition = {
  id: 'solanaid',
  name: 'Staking',
  platformId: 'solanaid',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
