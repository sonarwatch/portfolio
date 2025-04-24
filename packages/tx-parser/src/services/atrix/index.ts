import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

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

const farmService: ServiceDefinition = {
  id: `${platformId}-farm`,
  name: 'Farms',
  platformId,
  networkId: NetworkId.solana,
  contracts: [farmContract],
};

const poolService: ServiceDefinition = {
  id: `${platformId}-pool`,
  name: 'Pools',
  platformId,
  networkId: NetworkId.solana,
  contracts: [poolContract],
};

export const services: ServiceDefinition[] = [poolService, farmService];
export default services;
