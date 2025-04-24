import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

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

const service: ServiceDefinition = {
  id: 'futarchy-dao',
  name: 'DAO',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};
const launchpadService: ServiceDefinition = {
  id: 'futarchy-launchpad',
  name: 'Launchpad',
  platformId,
  networkId: NetworkId.solana,
  contracts: [launchpadContract],
};

export const services: ServiceDefinition[] = [service, launchpadService];
export default services;
