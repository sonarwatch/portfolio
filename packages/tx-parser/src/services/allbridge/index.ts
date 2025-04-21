import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'allbridge';
const contract = {
  name: 'Bridge',
  address: 'BrdgN2RPzEMWF96ZbnnJaUtQDQx7VRXYaHHbYCBvceWB',
  platformId,
};

const service: Service = {
  id: `${platformId}-bridge`,
  name: 'Bridge',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
