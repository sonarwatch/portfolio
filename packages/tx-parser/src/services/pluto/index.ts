import { NetworkId, Service } from '@sonarwatch/portfolio-core';
import { jupiterSwapContract } from '../jupiter';

const platformId = 'pluto';

const contract = {
  name: 'Leverage Machine',
  address: '5UFYdXHgXLMsDzHyv6pQW9zv3fNkRSNqHwhR7UPnkhzy',
  platformId,
};

const service: Service = {
  id: `${platformId}-leverage`,
  name: 'Leverage',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};
const withJupiterSwapService: Service = {
  id: `${platformId}-leverage-with-jupiter-swap`,
  name: 'Leverage',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract, jupiterSwapContract],
};

export const services: Service[] = [service, withJupiterSwapService];
export default services;
