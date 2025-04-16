import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'gpool';
const contract = {
  name: 'Staking',
  address: 'poo1sKMYsZtDDS7og73L68etJQYyn6KXhXTLz1hizJc',
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
