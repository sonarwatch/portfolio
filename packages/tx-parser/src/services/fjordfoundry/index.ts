import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'fjordfoundry';
const contract = {
  name: 'Bootstrap',
  address: 'w4cy1r9U7ag99RfBjb3Mz69oiANFeQystgQXerwUWLM',
  platformId,
};

const service: Service = {
  id: `${platformId}-bootstrap`,
  name: 'Bootstrap',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
