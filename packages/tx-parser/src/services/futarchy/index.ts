import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'futarchy';
const contract = {
  name: 'Futarchy DAO',
  address: 'autoQP9RmUNkzzKRXsMkWicDVZ3h29vvyMDcAYjCxxg',
  platformId,
};

const service: Service = {
  id: 'futarchy-dao',
  name: 'Futarchy DAO',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
