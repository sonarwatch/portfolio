import { NetworkId, Service } from '@sonarwatch/portfolio-core';

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

const governanceV1Service: Service = {
  id: `${platformId}-governance-v1`,
  name: 'Governance V1',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const governanceV2Service: Service = {
  id: `${platformId}-governance-v2`,
  name: 'Governance V2',
  platformId,
  networkId: NetworkId.solana,
  contracts: [daoContract],
};

export const services: Service[] = [governanceV1Service, governanceV2Service];
export default services;
