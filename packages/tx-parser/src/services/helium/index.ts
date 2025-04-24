import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'helium';
const contract = {
  name: 'Voter Stake Registry',
  address: 'hvsrNC3NKbcryqDs2DocYHZ9yPKEVzdSjQG6RVtK1s8',
  platformId,
};

const daoContract = {
  name: 'Sub DAO',
  address: 'hdaoVTCqhfHHo75XdAMxBKdUqvq1i5bF23sisBqVgGR',
  platformId,
};

const governanceV1Service: ServiceDefinition = {
  id: `${platformId}-governance-v1`,
  name: 'Governance V1',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const governanceV2Service: ServiceDefinition = {
  id: `${platformId}-governance-v2`,
  name: 'Governance V2',
  platformId,
  networkId: NetworkId.solana,
  contracts: [daoContract],
};

export const services: ServiceDefinition[] = [
  governanceV1Service,
  governanceV2Service,
];
export default services;
