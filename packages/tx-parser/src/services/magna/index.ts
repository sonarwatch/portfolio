import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'magna';

const airdropContract = {
  name: 'Vesting Airdrop',
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

const maintContract = {
  name: 'Core',
  address: 'magnaSHyv8zzKJJmr8NSz5JXmtdGDTTFPEADmvNAwbj',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-core`,
  name: 'Asset Management',
  platformId,
  networkId: NetworkId.solana,
  contracts: [maintContract],
};

export const services: ServiceDefinition[] = [service, airdropService];
export default services;
