import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'pengu';
const contract = {
  name: 'Airdrop',
  address: 'CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR',
  platformId,
};

const service: Service = {
  id: `${platformId}-airdrop`,
  name: 'Airdrop',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
