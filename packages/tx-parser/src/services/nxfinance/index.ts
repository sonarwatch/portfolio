import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'nxfinance';

const contract = {
  name: 'Lend',
  address: 'NXFiKimQN3QSL3CDhCXddyVmLfrai8HK36bHKaAzK7g',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-lend`,
  name: 'Lend',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const leverageContract = {
  name: 'Leverage',
  address: 'EHBN9YKtMmrZhj8JZqyBQRGqyyeHw5xUB1Q5eAHszuMt',
  platformId,
};

const leverageService: ServiceDefinition = {
  id: `${platformId}-leverage`,
  name: 'Leverage',
  platformId,
  networkId: NetworkId.solana,
  contracts: [leverageContract],
};

const stakingContract = {
  name: 'Staking',
  address: '9un1MopS4NRhgVDLXB1DqoQDTmq1un48YKJuPiMLpSc9',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: ServiceDefinition[] = [
  service,
  stakingService,
  leverageService,
];
export default services;
