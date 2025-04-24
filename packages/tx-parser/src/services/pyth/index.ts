import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'pyth';
const contract = {
  name: 'Staking',
  address: 'pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ',
  platformId,
};

export const expressRelayContract = {
  name: 'Express Relay',
  address: 'PytERJFhAKuNNuaiXkApLfWzwNwSNDACpigT3LwQfou',
  platformId,
};

const governanceContract = {
  name: 'Governance',
  address: 'pytGY6tWRgGinSCvRLnSv4fHfBTMoiDGiCsesmHWM6U',
  platformId,
};

const stakingService: Service = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const governanceService: Service = {
  id: `${platformId}-governance`,
  name: 'Governance',
  platformId,
  networkId: NetworkId.solana,
  contracts: [governanceContract],
};

const expressRelayService: Service = {
  id: `${platformId}-express-relay`,
  name: 'Express Relay',
  platformId,
  networkId: NetworkId.solana,
  contracts: [expressRelayContract],
};

export const services: Service[] = [
  stakingService,
  expressRelayService,
  governanceService,
];
export default services;
