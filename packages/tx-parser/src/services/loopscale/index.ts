import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Loopscale',
  address: '1oopBoJG58DgkUVKkEzKgyG9dvRmpgeEm1AVjoHkF78',
  platformId: 'loopscale',
};

const creditBookContract = {
  name: 'CreditBook',
  address: 'abfcSQac2vK2Pa6UAJb37DzarVxF15bDTdphJzAqYYp',
  platformId: 'loopscale',
};

const service: ServiceDefinition = {
  id: 'loopscale',
  name: 'Loopscale',
  platformId: 'loopscale',
  networkId: NetworkId.solana,
  contracts: [contract],
};

const creditBookService: ServiceDefinition = {
  id: 'loopscale-creditbook',
  name: 'CreditBook',
  platformId: 'loopscale',
  networkId: NetworkId.solana,
  contracts: [creditBookContract],
};

export const services: ServiceDefinition[] = [service, creditBookService];
export default services;
