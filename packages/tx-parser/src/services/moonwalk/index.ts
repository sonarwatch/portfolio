import { Contract, NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'moonwalk';

const mainContract: Contract = {
  name: `Game`,
  address: 'FitAFk15vtx2PBjfr7QTnefaHRx6HwajRiZMt1DdSSKU',
  platformId,
};

export const services: ServiceDefinition[] = [
  {
    id: `${platformId}-game`,
    name: 'Game',
    platformId,
    networkId: NetworkId.solana,
    contracts: [mainContract],
  },
];

export default services;
