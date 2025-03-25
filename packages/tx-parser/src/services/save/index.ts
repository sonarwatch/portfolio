import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Save',
  address: 'So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo',
  platformId: 'save',
};

const service: Service = {
  id: 'save',
  name: 'Save',
  platformId: 'save',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
