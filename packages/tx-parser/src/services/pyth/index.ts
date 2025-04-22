import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'pyth';
const contract = {
  name: 'Staking',
  address: 'pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ',
  platformId,
};

const expressRelayContract = {
  name: 'Express Relay',
  address: 'PytERJFhAKuNNuaiXkApLfWzwNwSNDACpigT3LwQfou',
  platformId,
};

const stakingService: Service = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const expressRelayService: Service = {
  id: `${platformId}-express-relay`,
  name: 'Express Relay',
  platformId,
  networkId: NetworkId.solana,
  contracts: [expressRelayContract],
};

export const services: Service[] = [stakingService, expressRelayService];
export default services;
