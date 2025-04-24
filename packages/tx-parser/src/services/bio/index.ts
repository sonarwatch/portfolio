import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'bio';
const contract = {
  name: 'Launchpad',
  address: '6M3fyRE18t6c7f9qes3eQMzR4QyPRMFZiyNQcApENCYf',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-launchpad`,
  name: 'Launchpad',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
