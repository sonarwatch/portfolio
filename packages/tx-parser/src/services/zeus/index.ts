import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'zeus';
const zetaContract = {
  name: 'Delegator',
  address: 'ZPLt7XEyRvRxEZcGFGnRKGLBymFjQbwmgTZhMAMfGAU',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-delegator`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [zetaContract],
};

export const services: ServiceDefinition[] = [stakingService];
export default services;
