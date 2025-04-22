import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'sandglass';
const mainContract = {
  name: 'Markets',
  address: 'SANDsy8SBzwUE8Zio2mrYZYqL52Phr2WQb9DDKuXMVK',
  platformId,
};

const mainService: Service = {
  id: `${platformId}-markets`,
  name: 'Markets',
  platformId,
  networkId: NetworkId.solana,
  contracts: [mainContract],
};

export const services: Service[] = [mainService];
export default services;
