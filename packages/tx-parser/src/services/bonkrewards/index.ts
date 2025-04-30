import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'bonkrewards';
const contract = {
  name: 'Staking',
  address: 'STAKEkKzbdeKkqzKpLkNQD3SUuLgshDKCD7U8duxAbB',
  platformId,
};

const fireContract = {
  name: 'Fire',
  address: 'FiRESpaNzgYUiba5vkb44CZJLZjrux1AUECdfwPRsNkg',
  platformId,
};

const swapContract = {
  name: 'Swap',
  address: 'BSwp6bEBihVLdqJRKGgzjcGLHkcTuzmSo1TQkHepzH8p',
  platformId,
};

const bonkMasContract = {
  name: 'BonkMas',
  address: 'BMas2pUrC5GR1ZJFbJLy2UmBcEgCfdxB5QLSBrLRnvK4',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const fireService: ServiceDefinition = {
  id: `${platformId}-fire`,
  name: 'Fire',
  platformId,
  networkId: NetworkId.solana,
  contracts: [fireContract],
};

const swapService: ServiceDefinition = {
  id: `${platformId}-swap`,
  name: 'Swap',
  platformId,
  networkId: NetworkId.solana,
  contracts: [swapContract],
};

const bonkMasService: ServiceDefinition = {
  id: `${platformId}-bonkmas`,
  name: 'BONKmas',
  platformId,
  networkId: NetworkId.solana,
  contracts: [bonkMasContract],
};

export const services: ServiceDefinition[] = [
  stakingService,
  fireService,
  swapService,
  bonkMasService,
];
export default services;
