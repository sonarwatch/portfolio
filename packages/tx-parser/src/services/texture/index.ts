import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'texture';

const contract = {
  name: 'Lending',
  address: 'MLENdNkmK61mGd4Go8BJX9PhYPN3azrAKRQsAC7u55v',
  platformId,
};

const service: Service = {
  id: `${platformId}-lend`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
