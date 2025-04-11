import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'futarchy';
const contract = {
  name: 'Futarchy DAO',
  address: 'autoQP9RmUNkzzKRXsMkWicDVZ3h29vvyMDcAYjCxxg',
  platformId,
};

const launchpadContract = {
  name: 'Launchpad',
  address: 'AfJJJ5UqxhBKoE3grkKAZZsoXDE9kncbMKvqSHGsCNrE',
  platformId,
};

const service: Service = {
  id: 'futarchy-dao',
  name: 'DAO',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};
const launchpadService: Service = {
  id: 'futarchy-launchpad',
  name: 'Launchpad',
  platformId,
  networkId: NetworkId.solana,
  contracts: [launchpadContract],
};

export const services: Service[] = [service, launchpadService];
export default services;
