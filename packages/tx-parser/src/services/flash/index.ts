import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'FlashTrade',
  address: 'FLASH6Lo6h3iasJKWDs2F8TkW2UKf3s15C8PMGuVfgBn',
  platformId: 'flash',
};

const service: Service = {
  id: 'flash',
  name: 'FlashTrade',
  platformId: 'flash',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
