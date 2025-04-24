import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'texture';

const contract = {
  name: 'Lending',
  address: 'MLENdNkmK61mGd4Go8BJX9PhYPN3azrAKRQsAC7u55v',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-lend`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
