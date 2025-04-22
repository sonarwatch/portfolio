import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'famousfoxfederation';
const stakingContract = {
  name: 'Staking',
  address: 'FoXpJL1exLBJgHVvdSHNKyKu2xX2uatctH9qp6dLmfpP',
  platformId,
};

const stakingService: Service = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: Service[] = [stakingService];
export default services;
