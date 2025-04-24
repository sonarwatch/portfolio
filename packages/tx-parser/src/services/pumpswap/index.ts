import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'PumpSwap AMM',
  address: 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA',
  platformId: 'pumpswap',
};

const service: ServiceDefinition = {
  id: 'pumpswap',
  name: 'PumpSwap AMM',
  platformId: 'pumpswap',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
