import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'pudgy';
const contract = {
  name: 'Airdrop',
  address: 'CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-airdrop`,
  name: 'Airdrop',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
