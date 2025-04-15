import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'deBridge Vault',
  address: 'DBrLFG4dco1xNC5Aarbt3KEaKaJ5rBYHwysqZoeqsSFE',
  platformId: 'debridge',
};

const service: Service = {
  id: 'debridge-vault',
  name: 'deBridge Vault',
  platformId: 'debridge',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
