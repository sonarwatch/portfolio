import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'PumpSwap AMM',
  address: 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA',
  platformId: 'pumpswap',
};

const service: Service = {
  id: 'pumpswap',
  name: 'PumpSwap AMM',
  platformId: 'pumpswap',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
