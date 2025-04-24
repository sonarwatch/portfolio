import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'switchboard';

const contract = {
  name: 'On Demand',
  address: 'SBondMDrcV3K4kxZR1HNVT7osZxAHVHgYXL5Ze1oMUv',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-on-demand`,
  name: 'On Demand',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
