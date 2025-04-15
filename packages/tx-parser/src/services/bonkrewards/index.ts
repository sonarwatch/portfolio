import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Staking',
  address: 'STAKEkKzbdeKkqzKpLkNQD3SUuLgshDKCD7U8duxAbB',
  platformId: 'bonkrewards',
};

const service: Service = {
  id: 'bonkrewards-staking',
  name: 'Bonk Staking',
  platformId: 'bonkrewards',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
