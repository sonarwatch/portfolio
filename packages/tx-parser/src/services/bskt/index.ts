import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const bsktStakingContract = {
  name: 'BSKT Staking',
  address: 'DF8vgzUDH2CGywD7Gd9jd9Y5Kwmrx97h4Viumjo4rrr6',
  platformId: 'bskt',
};

const bsktStakingService: ServiceDefinition = {
  id: 'bskt-staking',
  name: 'BSKT Staking',
  platformId: 'bskt',
  networkId: NetworkId.solana,
  contracts: [bsktStakingContract],
};

export const services: ServiceDefinition[] = [bsktStakingService];
export default services;
