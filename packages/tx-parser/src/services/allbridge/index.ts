import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'allbridge';
const contract = {
  name: 'Bridge',
  address: 'BrdgN2RPzEMWF96ZbnnJaUtQDQx7VRXYaHHbYCBvceWB',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-bridge`,
  name: 'Bridge',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
