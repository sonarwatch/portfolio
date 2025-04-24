import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'magma';

const airdropContract = {
  name: 'Magma',
  address: '3zK38YBP6u3BpLUpaa6QhRHh4VXdv3J8cmD24fFpuyqy',
  platformId,
};

const airdropService: ServiceDefinition = {
  id: `${platformId}-airdrop`,
  name: 'Vesting Airdrop',
  platformId,
  networkId: NetworkId.solana,
  contracts: [airdropContract],
};

export const services: ServiceDefinition[] = [airdropService];
export default services;
