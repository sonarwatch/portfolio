import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'solayer';
const contract = {
  name: 'Airdrop',
  address: 'ARDPkhymCbfdan375FCgPnBJQvUfHeb7nHVdBfwWSxrp',
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
