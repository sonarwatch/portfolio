import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'solcasino';

const contract = {
  name: 'Solcasino',
  address: 'CQ36xjMHgmgwEM1yvJYUWg3YxMvzwM4Mntn6vZrMk86z',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-main`,
  name: 'Wallet',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
