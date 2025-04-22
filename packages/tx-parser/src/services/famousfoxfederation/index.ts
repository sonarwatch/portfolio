import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'famousfoxfederation';
const stakingContract = {
  name: 'Staking',
  address: 'FoXpJL1exLBJgHVvdSHNKyKu2xX2uatctH9qp6dLmfpP',
  platformId,
};

const mainContract = {
  name: 'Main',
  address: 'JUicemrQ1X9XizUh1Pcn1SMJoArP8udtEqG5vZiWvkz',
  platformId,
};

const stakingService: Service = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

const mainService: Service = {
  id: `${platformId}-tools`,
  name: 'Tool',
  platformId,
  networkId: NetworkId.solana,
  contracts: [mainContract],
};

export const services: Service[] = [stakingService, mainService];
export default services;
