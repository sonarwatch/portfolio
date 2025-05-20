import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'vidar';

const nokContract = {
  name: 'wNOK Minter',
  address: 'sta1L8xffHa3K1puWcTX1m4QWHek4Gs8PJZQtGEFwmX',
  platformId,
};

const ljupMinterContract = {
  name: 'LJUP Minter',
  address: '1juPgnkY3i9dGkcuZahmby3exN4qpoq5HZ7rKKZsKtA',
  platformId,
};

const safeLaunchContract = {
  name: 'SafeLaunch',
  address: 'SAFEuracFxm3sZfhUNtComzcyS4RTkcNccbkWWb4PH5',
  platformId,
};

const ljupService: ServiceDefinition = {
  id: `${platformId}-ljup`,
  name: 'LJUP Minter',
  platformId,
  networkId: NetworkId.solana,
  contracts: [ljupMinterContract],
};

const nokService: ServiceDefinition = {
  id: `${platformId}-wNOK`,
  name: 'wNOK Minter',
  platformId,
  networkId: NetworkId.solana,
  contracts: [nokContract],
};

const safeLaunchService: ServiceDefinition = {
  id: `${platformId}-safe-launch`,
  name: 'SafeLaunch',
  platformId,
  networkId: NetworkId.solana,
  contracts: [safeLaunchContract],
};

export const services: ServiceDefinition[] = [
  nokService,
  ljupService,
  safeLaunchService,
];
export default services;
