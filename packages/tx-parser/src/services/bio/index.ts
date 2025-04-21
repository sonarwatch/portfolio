import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'bio';
const contract = {
  name: 'Launchpad',
  address: '6M3fyRE18t6c7f9qes3eQMzR4QyPRMFZiyNQcApENCYf',
  platformId,
};

const service: Service = {
  id: `${platformId}-launchpad`,
  name: 'Launchpad',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
