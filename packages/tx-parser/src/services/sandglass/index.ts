import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'sandglass';
const mainContract = {
  name: 'Markets',
  address: 'SANDsy8SBzwUE8Zio2mrYZYqL52Phr2WQb9DDKuXMVK',
  platformId,
};

const mainService: ServiceDefinition = {
  id: `${platformId}-markets`,
  name: 'Markets',
  platformId,
  networkId: NetworkId.solana,
  contracts: [mainContract],
};

export const services: ServiceDefinition[] = [mainService];
export default services;
