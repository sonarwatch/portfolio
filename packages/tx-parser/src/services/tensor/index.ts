import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'tensor';
const contract = {
  name: 'Swap',
  address: 'TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN',
  platformId,
};

const airdropContract = {
  name: 'Magma',
  address: '3zK38YBP6u3BpLUpaa6QhRHh4VXdv3J8cmD24fFpuyqy',
  platformId,
};

const service: Service = {
  id: `${platformId}-swap`,
  name: 'Swap',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const airdropService: Service = {
  id: `${platformId}-airdrop`,
  name: 'Vesting Airdrop',
  platformId,
  networkId: NetworkId.solana,
  contracts: [airdropContract],
};

export const services: Service[] = [service, airdropService];
export default services;
