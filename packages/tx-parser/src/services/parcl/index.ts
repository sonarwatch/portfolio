import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Parcl',
  address: '3parcLrT7WnXAcyPfkCz49oofuuf2guUKkjuFkAhZW8Y',
  platformId: 'parcl',
};
const stakingContract = {
  name: 'Parcl Staking',
  address: '2gWf5xLAzZaKX9tQj9vuXsaxTWtzTZDFRn21J3zjNVgu',
  platformId: 'parcl',
};

export const services: ServiceDefinition[] = [
  {
    id: 'parcl',
    name: 'Liquidity & Trading',
    platformId: 'parcl',
    networkId: NetworkId.solana,
    contracts: [contract],
  },
  {
    id: 'parcl-staking',
    name: 'Staking',
    platformId: 'parcl',
    networkId: NetworkId.solana,
    contracts: [stakingContract],
  },
];
export default services;
