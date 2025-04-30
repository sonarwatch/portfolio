import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'smb';
const marketplaceContract = {
  name: 'Marketplace',
  address: 'J7RagMKwSD5zJSbRQZU56ypHUtux8LRDkUpAPSKH4WPp',
  platformId,
};
const service: ServiceDefinition = {
  id: `${platformId}-marketplace`,
  name: 'Marketplace',
  platformId,
  networkId: NetworkId.solana,
  contracts: [marketplaceContract],
};

export const services: ServiceDefinition[] = [service];
export default services;
