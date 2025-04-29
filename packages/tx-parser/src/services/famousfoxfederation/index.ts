import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

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

const missionsContract = {
  name: 'Missions',
  address: '6NcdQ5WTnrPoMLbP4kvpLYa4YSwKqkNHRRE8XVf5hmv9',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

const mainService: ServiceDefinition = {
  id: `${platformId}-tools`,
  name: 'Tool',
  platformId,
  networkId: NetworkId.solana,
  contracts: [mainContract],
};

const missionsService: ServiceDefinition = {
  id: `${platformId}-missions`,
  name: 'Missions',
  platformId,
  networkId: NetworkId.solana,
  contracts: [missionsContract],
};

export const services: ServiceDefinition[] = [
  stakingService,
  mainService,
  missionsService,
];
export default services;
