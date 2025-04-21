import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'pumpkin';
const contract = {
  name: 'Staking',
  address: 'ARFxpgenuFNbyoysFdqEwTgEdxtLtHbTHwCWHJjqWHTb',
  platformId,
};

const service: Service = {
  id: 'pumpkin-staking',
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
