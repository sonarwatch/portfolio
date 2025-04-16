import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'atrix';
const farmContract = {
  name: 'Staking',
  address: 'BLDDrex4ZSWBgPYaaH6CQCzkJXWfzCiiur9cSFJT8t3x',
  platformId,
};

const poolContract = {
  name: 'Staking',
  address: 'HvwYjjzPbXWpykgVZhqvvfeeaSraQVnTiQibofaFw9M7',
  platformId,
};

const farmService: Service = {
  id: `${platformId}-farm`,
  name: 'Farms',
  platformId,
  networkId: NetworkId.solana,
  contracts: [farmContract],
};

const poolService: Service = {
  id: `${platformId}-pool`,
  name: 'Pools',
  platformId,
  networkId: NetworkId.solana,
  contracts: [poolContract],
};

export const services: Service[] = [poolService, farmService];
export default services;
