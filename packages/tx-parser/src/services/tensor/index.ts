import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'tensor';

const cnftContract = {
  name: 'cNFT',
  address: 'TCMPhJdwDryooaGtiocG1u3xcYbRpiJzb283XfCZsDp',
  platformId,
};

const contract = {
  name: 'Swap',
  address: 'TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN',
  platformId,
};

const bidContract = {
  name: 'Bid',
  address: 'TB1Dqt8JeKQh7RLDzfYDJsq8KS4fS2yt87avRjyRxMv',
  platformId,
};

const airdropContract = {
  name: 'Magma',
  address: '3zK38YBP6u3BpLUpaa6QhRHh4VXdv3J8cmD24fFpuyqy',
  platformId,
};

const marketplaceService: ServiceDefinition = {
  id: `${platformId}-swap`,
  name: 'Marketplace',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const cnftService: ServiceDefinition = {
  id: `${platformId}-cnft`,
  name: 'Marketplace',
  platformId,
  networkId: NetworkId.solana,
  contracts: [cnftContract],
};

const airdropService: ServiceDefinition = {
  id: `${platformId}-airdrop`,
  name: 'Vesting Airdrop',
  platformId,
  networkId: NetworkId.solana,
  contracts: [airdropContract],
};

const bidService: ServiceDefinition = {
  id: `${platformId}-bid`,
  name: 'Bid',
  platformId,
  networkId: NetworkId.solana,
  contracts: [bidContract],
};

export const services: ServiceDefinition[] = [
  marketplaceService,
  airdropService,
  bidService,
  cnftService,
];
export default services;
