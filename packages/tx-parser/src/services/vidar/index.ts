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

export const services: ServiceDefinition[] = [nokService, ljupService];
export default services;
