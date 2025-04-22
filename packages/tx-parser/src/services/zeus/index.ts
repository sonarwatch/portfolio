import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'zeus';
const zetaContract = {
  name: 'Delegator',
  address: 'ZPLt7XEyRvRxEZcGFGnRKGLBymFjQbwmgTZhMAMfGAU',
  platformId,
};

const stakingService: Service = {
  id: `${platformId}-delegator`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [zetaContract],
};

export const services: Service[] = [stakingService];
export default services;
