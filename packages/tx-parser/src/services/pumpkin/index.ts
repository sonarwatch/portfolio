import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Pumpkin Staking',
  address: 'ARFxpgenuFNbyoysFdqEwTgEdxtLtHbTHwCWHJjqWHTb',
  platformId: 'pumpkin',
};

const service: Service = {
  id: 'pumpkin',
  name: 'Pumpkin Staking',
  platformId: 'pumpswap',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
