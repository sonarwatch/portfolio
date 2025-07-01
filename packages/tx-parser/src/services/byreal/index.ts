import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'byreal';
const clmmContract = {
  name: 'CLMMM',
  address: 'REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2',
  platformId: 'byreal',
};

const resetContract = {
  name: 'Reset',
  address: 'REALdpFGDDsiD9tvxYsXBTDpgH1gGQEqJ8YSLdYQWGD',
  platformId: 'byreal',
};

const routerContract = {
  name: 'Router',
  address: 'REALp6iMBDTctQqpmhBo4PumwJGcybbnDpxtax3ara3',
  platformId: 'byreal',
};

const rfqContract = {
  name: 'RFQ',
  address: 'REALFP9S4VmrAixmeYa68FrPKn4NVD2QFxxMfz9arhz',
  platformId: 'byreal',
};

const clmmService: ServiceDefinition = {
  id: 'byreal-clmm',
  networkId: NetworkId.solana,
  name: 'ByReal CLMM',
  contracts: [clmmContract],
  platformId,
};

const resetService: ServiceDefinition = {
  id: 'byreal-reset',
  networkId: NetworkId.solana,
  name: 'ByReal Reset',
  contracts: [resetContract],
  platformId,
};

const routerService: ServiceDefinition = {
  id: 'byreal-router',
  networkId: NetworkId.solana,
  name: 'ByReal Router',
  contracts: [routerContract],
  platformId,
};

const rfqService: ServiceDefinition = {
  id: 'byreal-rfq',
  networkId: NetworkId.solana,
  name: 'ByReal RFQ',
  contracts: [rfqContract],
  platformId,
};

export const services: ServiceDefinition[] = [
  clmmService,
  resetService,
  routerService,
  rfqService,
];
export default services;
