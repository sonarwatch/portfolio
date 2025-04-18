import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'huma';
const contract = {
  name: 'Permissionless',
  address: 'HumaXepHnjaRCpjYTokxY4UtaJcmx41prQ8cxGmFC5fn',
  platformId,
};

const service: Service = {
  id: `${platformId}-permissionless`,
  name: 'Permissionless',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
