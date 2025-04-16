import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'defiland';
const contract = {
  name: 'Staking',
  address: 'KJ6b6PswEZeNSwEh1po51wxnbX1C3FPhQPhg8eD2Y6E',
  platformId,
};

const stakingService: Service = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [stakingService];
export default services;
