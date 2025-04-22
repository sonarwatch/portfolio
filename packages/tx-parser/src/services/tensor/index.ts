import { NetworkId, Service } from '@sonarwatch/portfolio-core';

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

const marketplaceService: Service = {
  id: `${platformId}-swap`,
  name: 'Marketplace',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const cnftService: Service = {
  id: `${platformId}-cnft`,
  name: 'Marketplace',
  platformId,
  networkId: NetworkId.solana,
  contracts: [cnftContract],
};

const airdropService: Service = {
  id: `${platformId}-airdrop`,
  name: 'Vesting Airdrop',
  platformId,
  networkId: NetworkId.solana,
  contracts: [airdropContract],
};

const bidService: Service = {
  id: `${platformId}-bid`,
  name: 'Bid',
  platformId,
  networkId: NetworkId.solana,
  contracts: [bidContract],
};

export const services: Service[] = [
  marketplaceService,
  airdropService,
  bidService,
  cnftService,
];
export default services;
