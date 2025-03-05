import { Contract, NetworkId, Service } from '@sonarwatch/portfolio-core';
import { platform as exchangePlatform } from './exchange/constants';

export const jupiterSwapContract: Contract = {
  name: 'Jupiter Swap',
  address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
  platformId: exchangePlatform.id,
};

const swapService: Service = {
  id: `${exchangePlatform.id}-swap`,
  name: 'Swap',
  platformId: exchangePlatform.id,
  networkId: NetworkId.solana,
  contracts: [jupiterSwapContract],
};

export const services: Service[] = [swapService];
