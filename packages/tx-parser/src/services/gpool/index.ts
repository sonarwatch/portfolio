import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'gpool';

const stakingContract = {
  name: 'Staking',
  address: 'poo1sKMYsZtDDS7og73L68etJQYyn6KXhXTLz1hizJc',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: ServiceDefinition[] = [stakingService];
export default services;
