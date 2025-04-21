import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'hxro';
const contract = {
  name: 'Staking',
  address: '2jmux3fWV5zHirkEZCoSMEgTgdYZqkE9Qx2oQnxoHRgA',
  platformId,
};

const service: Service = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
