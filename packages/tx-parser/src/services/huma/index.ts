import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'huma';
const contract = {
  name: 'Permissionless',
  address: 'HumaXepHnjaRCpjYTokxY4UtaJcmx41prQ8cxGmFC5fn',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-permissionless`,
  name: 'Permissionless',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
