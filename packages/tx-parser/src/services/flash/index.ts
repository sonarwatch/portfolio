import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'FlashTrade',
  address: 'FLASH6Lo6h3iasJKWDs2F8TkW2UKf3s15C8PMGuVfgBn',
  platformId: 'flash',
};

const service: ServiceDefinition = {
  id: 'flash',
  name: 'Earn',
  platformId: 'flash',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
