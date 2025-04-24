import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'defiland';
const contract = {
  name: 'Staking',
  address: 'KJ6b6PswEZeNSwEh1po51wxnbX1C3FPhQPhg8eD2Y6E',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [stakingService];
export default services;
