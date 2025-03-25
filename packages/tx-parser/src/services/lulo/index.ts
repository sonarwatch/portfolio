import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Lulo',
  address: 'FL3X2pRsQ9zHENpZSKDRREtccwJuei8yg9fwDu9UN69Q',
  platformId: 'flexlend',
};

export const service: Service = {
  id: 'flexlend',
  name: 'Lulo',
  platformId: 'flexlend',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
