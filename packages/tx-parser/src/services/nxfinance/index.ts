import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'nxfinance';

const contract = {
  name: 'Lend',
  address: 'NXFiKimQN3QSL3CDhCXddyVmLfrai8HK36bHKaAzK7g',
  platformId,
};

const service: Service = {
  id: `${platformId}-lend`,
  name: 'Lend',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const stakingContract = {
  name: 'Staking',
  address: '9un1MopS4NRhgVDLXB1DqoQDTmq1un48YKJuPiMLpSc9',
  platformId,
};

const stakingService: Service = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: Service[] = [service, stakingService];
export default services;
