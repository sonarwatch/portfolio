import { Contract, NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'okx';

const aggregatorContract: Contract = {
  name: `Aggregator`,
  address: '6m2CDdhRgxpH4WjvdzxAYbGxwdGUz5MziiL5jek2kBma',
  platformId,
};

export const services: ServiceDefinition[] = [
  {
    id: `${platformId}-aggregator`,
    name: 'Aggregator',
    platformId,
    networkId: NetworkId.solana,
    contracts: [aggregatorContract],
  },
];
export default services;
