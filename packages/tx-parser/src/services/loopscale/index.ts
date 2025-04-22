import { NetworkId, Service } from '@sonarwatch/portfolio-core';

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

const service: Service = {
  id: 'loopscale',
  name: 'Loopscale',
  platformId: 'loopscale',
  networkId: NetworkId.solana,
  contracts: [contract],
};

const creditBookService: Service = {
  id: 'loopscale-creditbook',
  name: 'CreditBook',
  platformId: 'loopscale',
  networkId: NetworkId.solana,
  contracts: [creditBookContract],
};

export const services: Service[] = [service, creditBookService];
export default services;
