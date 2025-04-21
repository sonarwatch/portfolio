import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'switchboard';

const contract = {
  name: 'On Demand',
  address: 'SBondMDrcV3K4kxZR1HNVT7osZxAHVHgYXL5Ze1oMUv',
  platformId,
};

const service: Service = {
  id: `${platformId}-on-demand`,
  name: 'On Demand',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
