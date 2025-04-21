import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'solana';

const contract = {
  name: 'Staking',
  address: 'Stake11111111111111111111111111111111111111',
  platformId,
};

const service: Service = {
  id: `${platformId}-stake`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
